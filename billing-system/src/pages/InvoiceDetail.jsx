import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {getInvoice,updateInvoiceStatus} from "../api";

export default function InvoiceDetail() {
    const {id}=useParams();
    const[invoice, setInvoice] = useState(null);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState(null);

    async function fetchInvoice(){
        try{
            setLoading(true);
            const Data = await getInvoice(id);
            setInvoice(Data);
        }
        catch(error){
            setError(error.message);
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchInvoice();
    },[id]);

async function handleMarkPaid(){
  try{
  const updatedInvoice= await updateInvoiceStatus(id,{status:"paid"});
  setInvoice(updatedInvoice);
  } catch(error){
    setError(error.message);
  }


}

    return (
  <div>
    <h2>Invoice Detail</h2>

    {loading && <p>Loading...</p>}
    {error && <p style={{ color: "red" }}>{error}</p>}

    {!loading && !error && invoice && (
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
          Invoice #{invoice.id}
        </p>

        <hr />

        <p><strong>Bill To:</strong> {invoice.customerName}</p>

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
            {invoice.items.map((item, i) => (
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
          <p style={{ margin: "4px 0" }}>Subtotal: ${invoice.subtotal}</p>
          {invoice.discountPercent > 0 && (
            <p style={{ margin: "4px 0" }}>
              Discount ({invoice.discountPercent}%): −${invoice.discountAmount}
            </p>
          )}
          <p style={{ margin: "4px 0" }}>Tax: ${invoice.tax}</p>
          <p style={{ margin: "8px 0", fontSize: "1.2em", fontWeight: "bold", borderTop: "2px solid #333", paddingTop: "8px" }}>
            Total: ${invoice.total}
          </p>
        </div>

        <p style={{ marginTop: "16px" }}>
          Status: <strong>{invoice.status.toUpperCase()}</strong>
        </p>
        {invoice.status !== "paid" && (
          <button onClick={handleMarkPaid} style={{marginTop:"12px"}}>
            Mark as Paid
          </button>
        )}
      </div>
    )}
  </div>
);
}