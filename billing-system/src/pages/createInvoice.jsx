import { useState, useEffect } from 'react';
import { getCustomers, createCustomer, getProducts, createInvoice } from '../api';

export default function CreateInvoice() {

  // ---- STATE ----
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ productId: "", qty: 1 }]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [products, setProducts] = useState([]);

  // ---- LOAD CUSTOMERS + PRODUCTS ON PAGE MOUNT ----
  useEffect(() => {
    async function loadData() {
      try {
        const [customersData, productsData] = await Promise.all([
          getCustomers(),
          getProducts(),
        ]);
        setCustomers(customersData);
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      }
    }
    loadData();
  }, []);

  // ---- ADD A NEW BLANK ITEM ROW ----
  function addItems() {
    setItems([...items, { productId: "", qty: 1 }]);
  }

  // ---- REMOVE ONE ITEM ROW ----
  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  // ---- UPDATE ONE FIELD IN ONE ITEM ROW ----
  function updateItems(index, field, value) {
    const newItems = items.map((item, i) => {
      if (i !== index) return item;
      return { ...item, [field]: value };
    });
    setItems(newItems);
  }

  // ---- SUBMIT THE INVOICE ----
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!customerId) {
      setError("Please select a customer");
      return;
    }

    const validItems = items
      .filter((item) => item.productId !== "")
      .map((item) => ({
        productId: Number(item.productId),
        qty: Number(item.qty),
      }));

    if (validItems.length === 0) {
      setError("Please add at least one item");
      return;
    }

    try {
      const invoice = await createInvoice({
        customerId: Number(customerId),
        items: validItems,
        discountPercent: Number(discountPercent),
      });
      setResult(invoice);
    } catch (err) {
      setError(err.message);
    }
  }

  // ---- RENDER ----
  return (
    <div>
      <form onSubmit={handleSubmit}>

        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          <option value="">Select customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {items.map((item, index) => (
          <div key={index}>
            <select
              value={item.productId}
              onChange={(e) => updateItems(index, "productId", e.target.value)}
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ${p.price}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={item.qty}
              onChange={(e) => updateItems(index, "qty", parseInt(e.target.value))}
            />

            <button type="button" onClick={() => removeItem(index)}>
              Remove
            </button>
          </div>
        ))}

        <label>
          Discount %:
          <input
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
          />
        </label>

        <button type="button" onClick={addItems}>
          Add Item
        </button>

        <button type="submit">Create Invoice</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
{result && (
  <div style={{
    maxWidth: "500px",
    margin: "20px 0",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
  }}>
    <h2 style={{ textAlign: "center", marginBottom: "4px" }}>INVOICE</h2>
    <p style={{ textAlign: "center", color: "#666", marginTop: 0 }}>
      Invoice #{result.id}
    </p>

    <hr />

    <p><strong>Bill To:</strong> {result.customerName}</p>

    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
      <thead>
        <tr style={{ borderBottom: "2px solid #333", textAlign: "left" }}>
          <th style={{ padding: "6px 0" }}>Item</th>
          <th style={{ padding: "6px 0" }}>Qty</th>
          <th style={{ padding: "6px 0" }}>Price</th>
          <th style={{ padding: "6px 0", textAlign: "right" }}>Total</th>
        </tr>
      </thead>
      <tbody>
        {result.items.map((item, i) => (
          <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "6px 0" }}>{item.name}</td>
            <td style={{ padding: "6px 0" }}>{item.qty}</td>
            <td style={{ padding: "6px 0" }}>${item.price}</td>
            <td style={{ padding: "6px 0", textAlign: "right" }}>${item.lineTotal}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div style={{ marginTop: "16px", textAlign: "right" }}>
      <p style={{ margin: "4px 0" }}>Subtotal: ${result.subtotal}</p>
      {result.discountPercent > 0 && (
        <p style={{ margin: "4px 0" }}>
          Discount ({result.discountPercent}%): −${result.discountAmount}
        </p>
      )}
      <p style={{ margin: "4px 0" }}>Tax: ${result.tax}</p>
      <p style={{ margin: "8px 0", fontSize: "1.2em", fontWeight: "bold", borderTop: "2px solid #333", paddingTop: "8px" }}>
        Total: ${result.total}
      </p>
    </div>

    <p style={{ marginTop: "16px" }}>
      Status: <strong>{result.status.toUpperCase()}</strong>
    </p>
  </div>
)}
    </div>
  );
}