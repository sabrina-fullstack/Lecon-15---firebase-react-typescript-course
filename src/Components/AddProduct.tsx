import { useState } from "react";
import { addDoc } from "firebase/firestore";
import { productsCollection } from "../collections";
import type { NewProduct } from "../types/product";
import "../App.css";
export function AddProduct() {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAddProduct(): Promise<void> {
    const newProduct: NewProduct = {
      name,
      price,
      description,
    };
    setLoading(true);
    try {
      await addDoc(productsCollection, newProduct);
      setMessage("Produit ajouté !");
      setName("");
      setPrice(0);
      setDescription("");
    } catch {
      setMessage("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="products-container">
      <h1>Ajouter un produit</h1>
      <div className="products-form">
        <input
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleAddProduct}>Ajouter le produit</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}
