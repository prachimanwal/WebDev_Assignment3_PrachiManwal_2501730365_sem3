// 404 Not Found middleware for unmatched routes
const notFound = (req, res, next) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.name}: ${err.message}`);

  // Mongoose bad ObjectId (CastError)
  if (err.name === "CastError") {
    return res.status(400).json({
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Mongoose duplicate key error (e.g., duplicate SKU)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const value = err.keyValue ? err.keyValue[field] : "";
    return res.status(400).json({
      message: `Duplicate value for ${field}: '${value}' already exists.`,
    });
  }

  // Mongoose schema validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  // Invalid JSON payload
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON payload in request body.",
    });
  }

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = {
  notFound,
  errorHandler,
};
