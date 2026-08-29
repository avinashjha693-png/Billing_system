Billing System

A full-stack billing/invoicing application built as an HR backend assessment project.

Tech Stack
Backend: Node.js, Express (in-memory storage, no database)
Frontend: React (Vite), React Router
Features
Product catalog: add and list products (name, price)
Customer management: add and list customers (name, phone)
Invoice creation: select a customer, add line items from the product catalog, apply an optional discount; server calculates subtotal, tax, and total
Invoice list and detail view
Mark invoices as paid
Running Locally

Start the backend first:

cd billing-backend
npm install
node server.js

Backend runs on http://localhost:5000

Then start the frontend in a separate terminal:

cd billing-system
npm install
npm run dev

Frontend runs on http://localhost:5173

Both the backend and frontend must be running at the same time.

Design Notes
In-memory storage: the backend does not use a database, so all data resets when the server restarts. This is a deliberate scope decision for this assessment, not a bug.
No authentication: kept intentionally simple, no user accounts.
Server-side price integrity: the client never sends prices directly, the backend looks up real product and customer data by ID when creating an invoice.
API Endpoints

GET /api/products - list all products
POST /api/products - create a product
GET /api/customers - list all customers
POST /api/customers - create a customer
GET /api/invoices - list all invoices
GET /api/invoices/:id - get one invoice
POST /api/invoices - create an invoice
PATCH /api/invoices/:id - update invoice status