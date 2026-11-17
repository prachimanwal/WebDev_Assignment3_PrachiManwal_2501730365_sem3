const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const productRoutes = require("./routes/productRoutes");
const noteRoutes = require("./routes/noteRoutes");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const Product = require("./models/Product");
const Note = require("./models/noteSchema");
const initialProducts = require("./data/initialProducts");
const initialNotes = require("./data/initialNotes");

const app = express();
const PORT = process.env.PORT || 5000;

// Built-in body-parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use(logger);

// Root status route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Inventory Management & iNoteBook API is running.",
    author: "Prachi Manwal",
    rollNumber: "2501730365",
    endpoints: {
      products: {
        getAllProducts: "GET    /api/products?page=1&limit=10&category=&sort=&search=",
        getProductById: "GET    /api/products/:id",
        createProduct: "POST   /api/products",
        updateProduct: "PUT    /api/products/:id",
        adjustStock: "PATCH  /api/products/:id/stock",
        deleteProduct: "DELETE /api/products/:id",
        lowStockReport: "GET    /api/products/low-stock",
        categorySummary: "GET    /api/products/summary",
      },
      iNoteBook_notes: {
        getNotes: "GET    /api/notes",
        getNoteById: "GET    /api/notes/:id",
        createNote: "POST   /api/notes",
        updateNote: "PUT    /api/update-note/:id (or PUT /api/notes/:id)",
        deleteNote: "DELETE /api/delete-note/:id (or DELETE /api/notes/:id)",
      },
      iNoteBook_users: {
        getUsers: "GET    /api/users",
        getUserById: "GET    /api/users/:id",
        createUser: "POST   /api/users",
        updateUser: "PUT    /api/update-user/:id (or PUT /api/users/:id)",
        deleteUser: "DELETE /api/delete-user/:id (or DELETE /api/users/:id)",
      },
    },
  });
});

// Product / Inventory API routes (Assignment 3)
app.use("/api/products", productRoutes);

// iNoteBook App routes (Notes & Users Schema CRUD)
app.use("/api", noteRoutes);
app.use("/api", userRoutes);

// 404 & Centralized Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB, seed initial catalogue & notes if empty, and start server
const startServer = async () => {
  await connectDB();

  const existingProductsCount = await Product.countDocuments();
  if (existingProductsCount === 0) {
    for (const item of initialProducts) {
      await Product.create(item);
    }
    console.log(`Seeded ${initialProducts.length} initial products into inventory_db.`);
  }

  const existingNotesCount = await Note.countDocuments();
  if (existingNotesCount === 0) {
    for (const note of initialNotes) {
      await Note.create(note);
    }
    console.log(`Seeded ${initialNotes.length} initial iNoteBook notes into inventory_db.`);
  }

  // Bind explicitly to loopback (IPv4 127.0.0.1 and IPv6 ::1) so macOS AirPlay Receiver (*:5000) never intercepts localhost:5000
  const http = require("http");
  http.createServer(app).listen(PORT, "127.0.0.1", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  const ipv6Server = http.createServer(app);
  ipv6Server.on("error", () => {});
  ipv6Server.listen(PORT, "::1");
};

startServer();

module.exports = app;
