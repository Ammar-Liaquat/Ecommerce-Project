# Ecommerce Backend API

This repository contains a **Node.js backend API for an e‑commerce system** built using **Express.js** and **MongoDB**.  
It includes user authentication, product management, and stock control functionalities.

## 🧰 Technologies Used

- **Node.js**  
- **Express.js**  
- **MongoDB & Mongoose**  
- **JWT Authentication (Access & Refresh Tokens)**  
- **bcrypt Password Hashing**  
- **Postman / Thunder Client for Testing**  
- **Git & GitHub**

## 🚀 Features

### 🔐 Authentication
- User registration  
- Login with JWT tokens  
- Secure password hashing (bcrypt)

### 🛍 Product Management
- Create, Read, Update, Delete (CRUD) operations for products  
- Admin access control for protected routes  
- Stock management

### 📦 API Endpoints (Examples)
POST /api/register
POST /api/login
GET /api/products
POST /api/products
PATCH /api/products/:id
DELETE /api/products/:id

_(Add full API list here if needed)_

## 📂 Installation

1. Clone the repo:
bash
git clone https://github.com/Ammar-Liaquat/Ecommerce-Project.git

Install dependencies:

npm install

Create your .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Run the project:

npm start
