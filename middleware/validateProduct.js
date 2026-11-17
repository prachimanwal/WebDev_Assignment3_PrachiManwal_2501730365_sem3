const mongoose = require("mongoose");

// Validate MongoDB ObjectId parameter
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: `Invalid product ID: ${id}`,
    });
  }
  next();
};

// Validate request body for creating a product
const validateCreateProduct = (req, res, next) => {
  const { name, sku, category, price, quantity, reorderLevel } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("Product 'name' is required and must be a non-empty string.");
  }

  if (!sku || typeof sku !== "string" || !sku.trim()) {
    errors.push("Product 'sku' is required and must be a non-empty string.");
  }

  if (!category || typeof category !== "string" || !category.trim()) {
    errors.push("Product 'category' is required and must be a non-empty string.");
  }

  if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
    errors.push("Product 'price' is required and must be a non-negative number.");
  }

  if (quantity !== undefined && (isNaN(Number(quantity)) || Number(quantity) < 0 || !Number.isInteger(Number(quantity)))) {
    errors.push("Product 'quantity' must be a non-negative integer.");
  }

  if (reorderLevel !== undefined && (isNaN(Number(reorderLevel)) || Number(reorderLevel) < 0 || !Number.isInteger(Number(reorderLevel)))) {
    errors.push("Product 'reorderLevel' must be a non-negative integer.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// Validate request body for updating a product
const validateUpdateProduct = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: "Request body cannot be empty when updating a product.",
    });
  }

  const { price, quantity, reorderLevel } = req.body;
  const errors = [];

  if (price !== undefined && (isNaN(Number(price)) || Number(price) < 0)) {
    errors.push("Product 'price' must be a non-negative number.");
  }

  if (quantity !== undefined && (isNaN(Number(quantity)) || Number(quantity) < 0 || !Number.isInteger(Number(quantity)))) {
    errors.push("Product 'quantity' must be a non-negative integer.");
  }

  if (reorderLevel !== undefined && (isNaN(Number(reorderLevel)) || Number(reorderLevel) < 0 || !Number.isInteger(Number(reorderLevel)))) {
    errors.push("Product 'reorderLevel' must be a non-negative integer.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// Validate request body for stock adjustment (PATCH /api/products/:id/stock)
const validateStockChange = (req, res, next) => {
  const { change } = req.body;

  if (change === undefined || change === null || typeof change !== "number" || isNaN(change) || !Number.isInteger(change)) {
    return res.status(400).json({
      message: "Field 'change' is required and must be an integer (positive to restock, negative for sale).",
    });
  }

  if (change === 0) {
    return res.status(400).json({
      message: "Stock 'change' cannot be zero.",
    });
  }

  next();
};

module.exports = {
  validateObjectId,
  validateCreateProduct,
  validateUpdateProduct,
  validateStockChange,
};
