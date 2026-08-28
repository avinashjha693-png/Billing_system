import { useState, useEffect } from 'react';
import { getCustomers, createCustomer } from '../api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  async function fetchCustomers() {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const payload = { name: name.trim() };
      if (phone.trim()) payload.phone = phone.trim();

      await createCustomer(payload);
      setName("");
      setPhone("");
      await fetchCustomers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Customers</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Customer name"
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
        />
        <button type="submit">Add Customer</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <ul>
          {customers.map((c) => (
            <li key={c.id}>
              {c.name} {c.phone ? `— ${c.phone}` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}