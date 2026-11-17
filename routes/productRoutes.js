const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  adjustStock,
  deleteProduct,
  getLowStockProducts,
  getCategorySummary,
} = require("../controllers/productController");

const {
  validateObjectId,
  validateCreateProduct,
  validateUpdateProduct,
  validateStockChange,
} = require("../middleware/validateProduct");

// Inventory Reports & Aggregation Endpoints (must be defined before /:id)
router.get("/low-stock", getLowStockProducts);
router.get("/summary", getCategorySummary);

// Collection Routes (/api/products)
router
  .route("/")
  .get(getAllProducts)
  .post(validateCreateProduct, createProduct);

// Stock Adjustment Route (/api/products/:id/stock)
router.patch("/:id/stock", validateObjectId, validateStockChange, adjustStock);

// Single Resource Routes (/api/products/:id)
router
  .route("/:id")
  .get(validateObjectId, getProductById)
  .put(validateObjectId, validateUpdateProduct, updateProduct)
  .delete(validateObjectId, deleteProduct);

module.exports = router;
