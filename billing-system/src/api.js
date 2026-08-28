const BASE_URL = "http://localhost:5000/api";

async function request(path, options={}) {
  const res = await fetch(BASE_URL + path, {
    headers: { "Content-Type": "application/json" },
     ...options,
  });

  if(!res.ok){
    let message= res.statusText;
    try{
        const body=await res.json();
        message=body.message||body.error||message;  
    }
    catch{

    }
    throw new Error(message);
  }
  return res.json();
}

export const getProducts = () => request("/products");
export const createProduct = (product) =>
  request("/products", { method: "POST", body: JSON.stringify(product) });

export const getCustomers = () => request("/customers");
export const createCustomer = (customer) =>
  request("/customers", { method: "POST", body: JSON.stringify(customer) });

export const getInvoices = () => request("/invoices");
export const getInvoice = (id) => request(`/invoices/${id}`);
export const createInvoice = (invoice) =>
  request("/invoices", { method: "POST", body: JSON.stringify(invoice) });
export const updateInvoiceStatus = (id, statusUpdate) =>
  request(`/invoices/${id}`, { method: "PATCH", body: JSON.stringify(statusUpdate) });