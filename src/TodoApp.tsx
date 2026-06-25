import type { Todo, NewTodo } from "./types/todo";
import { useEffect, useState } from "react";
import { todosCollection } from "./collections";
import {
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "./context/AuthContext";

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState<string>("");

  const { user } = useAuth();

  useEffect(() => {
    const q = query(todosCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData: Todo[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Todo,
      );
      setTodos(todosData);
    });
    return () => unsubscribe();
  }, []);

  async function addTodo(): Promise<void> {
    if (!text) return;
    const newTodo: NewTodo = {
      text,
      completed: false,
      createdAt: new Date(),
      userId: user?.uid || "",
    };
    await addDoc(todosCollection, newTodo);
    setText("");
  }

  async function deleteTodo(todo: Todo): Promise<void> {
    if (todo.userId !== user?.uid) return;
    await deleteDoc(doc(todosCollection, todo.id));
  }

  async function toggleTodo(todo: Todo): Promise<void> {
    if (todo.userId !== user?.uid) return;
    await updateDoc(doc(todosCollection, todo.id), {
      completed: !todo.completed,
    });
  }

  return (
    <div className="products-container">
      <h1>✅ Todo</h1>
      <div className="products-form">
        <input
          type="text"
          placeholder="Nouvelle tâche..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addTodo}>Ajouter</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="product-item"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo)}
            />
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                flex: 1,
              }}
            >
              {todo.text}
            </span>
            {todo.userId === user?.uid && (
              <button onClick={() => deleteTodo(todo)}>🗑️ Supprimer</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
