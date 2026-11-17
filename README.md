# Assignment 3: Inventory and Data Management System

- **Author:** Prachi Manwal
- **Roll Number:** 2501730365
- **Course:** Web Dev III (Unit 3)

A RESTful Inventory and Data Management backend (plus iNoteBook App schema CRUD) built with **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, and **dotenv**.

---

## Features & Learning Objectives Covered

1. **Mongoose Schema & Field-Level Validation** (`models/Product.js`)
   - Required fields, string trimming, length bounds, uppercase SKU normalization, regex validation (`FURN-TB-012`), non-negative integer stock quantities, default values, and timestamps (`createdAt`, `updatedAt`).
   - Virtual property `stockValue` (`price * quantity`) serialized automatically via `toJSON: { virtuals: true }`.
2. **Complete RESTful CRUD Operations** (`controllers/productController.js`)
   - `POST /api/products` — Create a new product
   - `GET /api/products` — Get products with filtering, searching, sorting, and pagination
   - `GET /api/products/:id` — Get single product by ID
   - `PUT /api/products/:id` — Update product details with schema validation
   - `PATCH /api/products/:id/stock` — Safe stock increment/decrement (`{ "change": 10 }` or negative for sales) preventing negative inventory
   - `DELETE /api/products/:id` — Delete a product by ID
3. **Inventory Reports & MongoDB Aggregation Pipelines**
   - `GET /api/products/low-stock` — Low-stock alert report (`quantity <= reorderLevel`)
   - `GET /api/products/summary` — Category-wise inventory summary (`$group`, `$project`, `$sort`) computing `totalItems`, `totalQuantity`, `totalStockValue`, and `avgPrice`.
4. **Middleware & Error Handling**
   - Request logger (`middleware/logger.js`)
   - Input & ObjectId validation (`middleware/validateProduct.js`)
   - Centralized error handler (`middleware/errorHandler.js`)

---

## Project Structure

```text
Assignment3-inventory-management-system/
├── config/
│   └── db.js                   # MongoDB connection using Mongoose
├── controllers/
│   └── productController.js    # CRUD, stock adjustment & aggregation logic
├── data/
│   ├── initialProducts.js      # 12 sample catalogue items
│   └── seed.js                 # Database seed script
├── middleware/
│   ├── errorHandler.js         # 404 & centralized error handling middleware
│   ├── logger.js               # HTTP request logger
│   └── validateProduct.js      # Input & ObjectId validation middleware
├── models/
│   └── Product.js              # Mongoose Product schema, validators & virtuals
├── routes/
│   └── productRoutes.js        # Express router for /api/products
├── .env                        # Environment variables (PORT, MONGO_URI)
├── .env.example                # Example environment variables
├── app.js                      # Express app setup & server entry point
├── server.js                   # Entry-point alias
└── package.json
```

---

## Setup & Running the Project

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Seed (or reset) initial product data:**
   ```bash
   npm run seed
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   The API runs on `http://localhost:5000`.

---

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List products (supports `?page=1&limit=10&category=Furniture&search=table&minPrice=100&maxPrice=5000&sort=-price`) |
| `POST` | `/api/products` | Create a new product |
| `GET` | `/api/products/low-stock` | Low-stock alert report (`quantity <= reorderLevel`) |
| `GET` | `/api/products/summary` | Category-wise aggregation summary |
| `GET` | `/api/products/:id` | Get a single product by ID |
| `PUT` | `/api/products/:id` | Update product details |
| `PATCH` | `/api/products/:id/stock` | Adjust stock (`{ "change": 10 }` or `{ "change": -2 }`) |
| `DELETE` | `/api/products/:id` | Delete product by ID |
