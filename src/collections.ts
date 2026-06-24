import { collection } from "firebase/firestore";
import { db } from "./firebase";

export const todosCollection = collection(db, "todos");
