import express from "express";
import cors from "cors";
import invoiceRoutes from "./routes/invoice.js";
import productRoutes from "./routes/product.js";
import customerRoutes from "./routes/customer.js";

const app = express();

app.use(cors());          // this api will be called by react
app.use(express.json());  

app.use("/api/invoices", invoiceRoutes); 
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});