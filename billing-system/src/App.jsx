import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Products from "./pages/product";
import Customers from "./pages/customer";
import CreateInvoice from "./pages/createInvoice";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/products">Products</Link> |{" "}
        <Link to="/customers">Customers</Link> |{" "}
        <Link to="/invoices/new">Create Invoice</Link>
      </nav>

      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/invoices/new" element={<CreateInvoice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;