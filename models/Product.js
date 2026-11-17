const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters long"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      uppercase: true,
      trim: true,
      match: [
        /^[A-Z0-9-]+$/,
        "SKU must contain only uppercase letters, numbers, and hyphens (e.g., FURN-TB-012)",
      ],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      minlength: [2, "Category must be at least 2 characters long"],
      maxlength: [50, "Category cannot exceed 50 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number (integer)",
      },
    },
    reorderLevel: {
      type: Number,
      min: [0, "Reorder level cannot be negative"],
      default: 10,
      validate: {
        validator: Number.isInteger,
        message: "Reorder level must be a whole number (integer)",
      },
    },
    supplier: {
      type: String,
      trim: true,
      default: "Unknown Supplier",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for total stock value of the product (price * quantity)
productSchema.virtual("stockValue").get(function () {
  if (this.price == null || this.quantity == null) return 0;
  return Number((this.price * this.quantity).toFixed(2));
});

// Indexes for optimized querying, filtering, and sorting
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ quantity: 1, reorderLevel: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
