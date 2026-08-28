import { useState, useEffect } from 'react';
import { getProducts, createProduct } from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  async function fetchProducts() {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !price) return;

    try {
      await createProduct({ name: name.trim(), price: parseFloat(price) });
      setName("");
      setPrice("");
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Products</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
        />
        <button type="submit">Add Product</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              {p.name} — ${p.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}