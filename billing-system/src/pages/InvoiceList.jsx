import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {getInvoices} from "../api";

export default function InvoiceList() {

const[invoices, setInvoices] = useState([]);
const[loading, setLoading] = useState(true);
const[error, setError] = useState(null);

async function fetchInvoices(){
    
        try{
            setLoading(true);
            const data= await getInvoices();
            setInvoices(data);
            

        }
        catch(error){
            setError(error.message);
        }
        finally{
            setLoading(false);
        }
    }
useEffect(()=>{
    fetchInvoices();
},[]);
return (
  <div>
    <h2>Invoices</h2>

    {loading && <p>Loading...</p>}
    {error && <p style={{ color: "red" }}>{error}</p>}

    {!loading && !error && (
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #333" }}>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>
                <Link to={`/invoices/${inv.id}`}>{inv.customerName}</Link>
              </td>
              <td>${inv.total}</td>
              <td>{inv.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
}
