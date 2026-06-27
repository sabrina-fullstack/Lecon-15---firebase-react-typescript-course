import { useState, useEffect } from "react";

import { productsCollection } from "../collections";
import { db } from "../firebase";
import type { Product } from "../types/product";
import "../App.css";
import { getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

export function GetAllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);

  async function handleUpdatePrice(id: string): Promise<void> {
    await updateDoc(doc(db, "products", id), { price: newPrice });
    // updateDoc = mettre à jour un champ du document
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p)),
    );
    // map = pour chaque produit, si c'est le bon id → change le prix
    setEditingId(null);
    // ferme le mode édition
  }
  async function handleDelete(id: string): Promise<void> {
    await deleteDoc(doc(db, "products", id));
    // deleteDoc = supprimer le document de Firestore
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // filter = garder seulement les produits dont l'id est différent
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(productsCollection);
        const allProducts = querySnapshot.docs.map((doc) => doc.data());
        const sorted = [...allProducts].sort((a, b) => a.price - b.price);
        setProducts(sorted);
      } catch {
        setError("Erreur lors du chargement des produits");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="products-container">
      <h1>Liste des produits</h1>

      <button
        onClick={() => {
          setProducts((prev) =>
            [...prev].sort((a, b) =>
              sortAsc ? b.price - a.price : a.price - b.price,
            ),
          );
          setSortAsc(!sortAsc);
        }}
      >
        {sortAsc ? "Prix ↑" : "Prix ↓"}
      </button>

      {loading && <p>Chargement...</p>}
      {error && <p>{error}</p>}

      {products.map((product) => (
        <div key={product.id} className="product-item">
          <p>
            {product.name} | ₪{product.price}
          </p>
          <p>{product.description}</p>

          <button onClick={() => handleDelete(product.id)}>🗑️ Supprimer</button>

          {/* Ajoute ici le mode édition */}
          {editingId === product.id ? (
            <div>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
              />
              <button onClick={() => handleUpdatePrice(product.id)}>
                ✅ Sauvegarder
              </button>
              <button onClick={() => setEditingId(null)}>❌ Annuler</button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditingId(product.id);
                setNewPrice(product.price);
              }}
            >
              ✏️ Modifier prix
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
