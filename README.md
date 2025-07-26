# Backend API Server

This is the Express backend for the Product Inventory Management app. It connects to MongoDB using Mongoose and exposes RESTful endpoints for managing products and categories.


## Setup

1. Install dependencies (requires Node.js):
   ```
   npm install
   ```

2. Start the server (with automatic reloads):
   ```
   npm run dev
   ```

The server will run on `http://localhost:3001` by default.

### API Endpoints

- `GET /api/products` – list products (supports `category`, `minStock`, `maxStock` query params)
- `POST /api/products` – create product
- `PUT /api/products/:id` – update product
- `DELETE /api/products/:id` – delete product
- `GET /api/categories` – list categories
- `POST /api/categories` – create category
- `PUT /api/categories/:id` – update category
- `DELETE /api/categories/:id` – delete category
