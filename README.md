POS API (Node.js + MySQL)

DESCRIPTION
-----------
This project is a Point of Sale (POS) API built with Node.js and MySQL.

It focuses on a layered architecture (Controller, Service, Repository) and includes authentication, product management, and sales processing with multiple items per sale.

The authentication system was developed in a separate project and integrated here.

---

TECHNOLOGIES
-------------
- Node.js
- Express
- MySQL (mysql2)
- JWT (authentication)
- bcrypt (password hashing)

---

ARCHITECTURE
-------------
- controllers → handle HTTP requests
- services → business logic
- repositories → database queries
- middlewares → authentication and rate limiting

---

AUTHENTICATION
--------------
JWT-based authentication system.

Endpoints:
- POST /auth/register
- POST /auth/login

Note: Authentication was implemented in a separate project and reused here.

---

PRODUCTS
--------

Create product:
POST /products (requires token)

Body:
{
  "name": "Product",
  "barcode": "123",
  "price": 10,
  "cost": 5,
  "stock": 20,
  "categoryId": 1,
  "isActive": true
}

Get all products:
GET /products (requires token)

---

SALES
-----

Create sale:
POST /sales (requires token)

Body:
{
  "subtotal": 100,
  "discount": 10,
  "total": 90,
  "paymentMethod": "PIX",
  "status": "PAID",
  "products": [
    { "id": 1, "quantity": 2 },
    { "id": 2, "quantity": 1 }
  ]
}

Note: The "products" array is used internally to generate sale items (saleItens). These are automatically created by the backend and are NOT sent separately by the client.

Get all sales:
GET /sales/:userId

Get sale by ID:
GET /sales/:userId/:id

Update sale:
PUT /sales/:userId/:id

Delete sale:
DELETE /sales/:userId/:id

---

CONFIGURATION
-------------
Create a .env file:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=pdv
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d

---

RUNNING THE PROJECT
-------------------
Install dependencies:
npm install

Start server:
node index.js

---

PROJECT GOAL
------------
This project was built for learning purposes, focusing on:

- Layered architecture
- REST API design
- JWT authentication
- MySQL integration
- Sales system with multiple items (saleItens)
