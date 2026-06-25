import { useState, useEffect } from "react";
import { getDocs } from "firebase/firestore";
import { productsCollection } from "../collections";
import type { Product } from "../types/product";
import "../App.css";
export function GetAllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(productsCollection);
        setProducts(querySnapshot.docs.map((doc) => doc.data()));
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
      {loading && <p>Chargement...</p>}
      {error && <p>{error}</p>}
      {products.map((product) => (
        <div key={product.id} className="product-item">
          <p>
            {product.name} | ₪{product.price}
          </p>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}
