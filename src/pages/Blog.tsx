import type { BlogPost, NewBlogPost } from "../types/blog";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    // getDocs — lecture unique (demandé par le prof)
    // getDocs(q).then((snapshot) => {
    //   const postsData: BlogPost[] = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   } as BlogPost))
    //   setPosts(postsData)
    // })

    // onSnapshot — temps réel (meilleure solution)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: BlogPost[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as BlogPost,
      );
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  async function addPost(): Promise<void> {
    if (!title || !user) return;
    const newPost: NewBlogPost = {
      title,
      content,
      createdAt: new Date(),
      authorId: user.uid,
      authorName: user.displayName || "",
    };
    await addDoc(collection(db, "posts"), newPost);
    setTitle("");
    setContent("");
  }

  async function deletePost(post: BlogPost): Promise<void> {
    console.log("authorId:", post.authorId);
    console.log("user uid:", user?.uid);
    if (post.authorId !== user?.uid) return;
    await deleteDoc(doc(db, "posts", post.id));
  }
  async function updatePost(
    post: BlogPost,
    data: Partial<BlogPost>,
  ): Promise<void> {
    if (post.authorId !== user?.uid) return;
    await updateDoc(doc(db, "posts", post.id), data);
  }
  return (
    <div className="App">
      <h1>Blog</h1>
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Contenu"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={addPost}>Ajouter</button>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Auteur: {post.authorName}</p>
          <button onClick={() => deletePost(post)}>Supprimer</button>
          <button
            onClick={() => {
              const newTitle = prompt("Nouveau titre ?");
              if (newTitle) updatePost(post, { title: newTitle });
            }}
          >
            Modifier
          </button>
        </div>
      ))}
    </div>
  );
}
