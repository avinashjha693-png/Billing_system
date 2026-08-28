# Billing System

A full-stack billing/invoicing application built as an HR backend assessment project.

## Tech Stack

- **Backend:** Node.js, Express (in-memory storage — no database)
- **Frontend:** React (Vite), React Router

## Features

- Product catalog — add and list products (name, price)
- Customer management — add and list customers (name, phone)
- Invoice creation — select a customer, add line items from the product catalog, apply an optional discount; server calculates subtotal, tax, and total
- Invoice list & detail view
- Mark invoices as paid

## Project Structure
billing-backend/ # Express API (port 5000)
billing-system/ # React frontend (Vite)

## Running Locally

**1. Start the backend:**
```bash
cd billing-backend
npm install
node server.js
```
Backend runs on `http://localhost:5000`.

**2. Start the frontend** (in a separate terminal):
```bash
cd billing-system
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` (default Vite port).

> Both the backend and frontend must be running simultaneously.

## Design Notes

- **In-memory storage:** the backend does not use a database — all data (products, customers, invoices) resets when the server restarts. This was a deliberate scope decision for this assessment, not a bug.
- **No authentication:** kept intentionally simple, no user accounts.
- **Server-side price integrity:** the client never sends prices directly — the backend looks up real product/customer data by ID when creating an invoice, preventing price tampering from the client.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| POST | `/api/products` | Create a product |
| GET | `/api/customers` | List all customers |
| POST | `/api/customers` | Create a customer |
| GET | `/api/invoices` | List all invoices |
| GET | `/api/invoices/:id` | Get one invoice |
| POST | `/api/invoices` | Create an invoice |
| PATCH | `/api/invoices/:id` | Update invoice status (mark paid/unpaid) |