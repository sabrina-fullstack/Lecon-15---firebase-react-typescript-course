import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Note, NewNote, Category } from "./types/note";
function App() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [category, setCategory] = useState<Category>("work");
  const [filter, setFilter] = useState<Category | "all">("all");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (!user) return;

    // Requête avec filtre ET tri
    const q =
      filter === "all"
        ? query(collection(db, "notes"), orderBy("createdAt", "desc"))
        : query(
            collection(db, "notes"),
            where("category", "==", filter),
            orderBy("createdAt", "desc"),
          );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData: Note[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Note,
      );
      setNotes(notesData);
    });
    return () => unsubscribe();
  }, [user, filter]);

  async function addNote(): Promise<void> {
    if (!title || !user) return;
    const newNote: NewNote = {
      title,
      body,
      createdAt: new Date(),
      category,
    };
    await addDoc(collection(db, "notes"), newNote);
    setTitle("");
    setBody("");
  }

  async function deleteNote(id: string): Promise<void> {
    await deleteDoc(doc(db, "notes", id));
  }

  if (loading) return <p>Chargement...</p>;

  if (!user) {
    return showRegister ? (
      <>
        <Register />
        <button onClick={() => setShowRegister(false)}>
          Déjà un compte ? Login
        </button>
      </>
    ) : (
      <>
        <Login />
        <button onClick={() => setShowRegister(true)}>
          Pas de compte ? S'inscrire
        </button>
      </>
    );
  }

  // Filtre de recherche par titre
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="notes-container">
      <h1>📝 Mes Notes</h1>
      <p>Connecté : {user.email}</p>
      <button onClick={() => signOut(auth)}>🚪 Se déconnecter</button>

      {/* Formulaire */}
      <div className="notes-form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Contenu"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          <option value="work">💼 Travail</option>
          <option value="personal">👤 Personnel</option>
          <option value="ideas">💡 Idées</option>
        </select>
        <button onClick={addNote}>Ajouter</button>
      </div>

      {/* Filtres */}
      <div className="notes-filters">
        <button onClick={() => setFilter("all")}>Toutes</button>
        <button onClick={() => setFilter("work")}>💼 Travail</button>
        <button onClick={() => setFilter("personal")}>👤 Personnel</button>
        <button onClick={() => setFilter("ideas")}>💡 Idées</button>
      </div>

      {/* Recherche */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Rechercher..."
      />

      {/* Liste des notes */}
      {filteredNotes.map((note: Note) => (
        <div key={note.id} className="note-item">
          <h3>{note.title}</h3>
          <p>{note.body}</p>
          <small>{note.category}</small>
          <button onClick={() => deleteNote(note.id)}>🗑️ Supprimer</button>
        </div>
      ))}
    </div>
  );
}

export default App;
