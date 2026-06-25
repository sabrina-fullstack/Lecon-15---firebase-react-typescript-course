import { collection } from "firebase/firestore";
import { db, createConverter } from "./firebase";
import type { Product } from "./types/product";

export const todosCollection = collection(db, "todos");
export const productsCollection = collection(db, "products").withConverter(
  createConverter<Product>(),
);
