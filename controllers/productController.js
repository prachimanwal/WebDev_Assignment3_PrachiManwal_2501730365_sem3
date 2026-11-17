const Product = require("../models/Product");

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @desc    Create a new product
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
const getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      supplier,
      search,
      name,
      minPrice,
      maxPrice,
      minQuantity,
      maxQuantity,
      inStock,
      sort,
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Filter by category (case-insensitive exact match)
    if (category) {
      filter.category = new RegExp(`^${escapeRegex(category.trim())}$`, "i");
    }

    // Filter by supplier (case-insensitive partial match)
    if (supplier) {
      filter.supplier = new RegExp(escapeRegex(supplier.trim()), "i");
    }

    // Search by product name, SKU, or category
    const searchQuery = search || name;
    if (searchQuery) {
      const regex = new RegExp(escapeRegex(searchQuery.trim()), "i");
      filter.$or = [{ name: regex }, { sku: regex }, { category: regex }];
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined && !isNaN(Number(minPrice))) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Quantity range filter
    if (minQuantity !== undefined || maxQuantity !== undefined) {
      filter.quantity = {};
      if (minQuantity !== undefined && !isNaN(Number(minQuantity))) {
        filter.quantity.$gte = Number(minQuantity);
      }
      if (maxQuantity !== undefined && !isNaN(Number(maxQuantity))) {
        filter.quantity.$lte = Number(maxQuantity);
      }
    }

    // In-stock filter (?inStock=true or ?inStock=false)
    if (inStock !== undefined) {
      if (inStock === "true") {
        filter.quantity = { ...(filter.quantity || {}), $gt: 0 };
      } else if (inStock === "false") {
        filter.quantity = 0;
      }
    }

    // Sorting configuration
    let sortOption = { _id: 1 };
    if (sort) {
      sortOption = sort.split(",").join(" ");
    } else if (sortBy) {
      const sortDirection = order && order.toLowerCase() === "desc" ? -1 : 1;
      sortOption = { [sortBy]: sortDirection };
    }

    // Pagination calculation
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      total,
      page: pageNum,
      totalPages,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product details by ID
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Adjust product stock safely (restock or sale)
// @route   PATCH /api/products/:id/stock
const adjustStock = async (req, res, next) => {
  try {
    const { change } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const newQuantity = product.quantity + Number(change);

    if (newQuantity < 0) {
      return res.status(400).json({
        message: `Insufficient stock for sale/decrement. Available quantity: ${product.quantity}, requested change: ${change}`,
      });
    }

    product.quantity = newQuantity;
    await product.save();

    res.status(200).json({
      message: "Stock updated",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product by ID
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted",
      id: product._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low-stock alert report (quantity <= reorderLevel)
// @route   GET /api/products/low-stock
const getLowStockProducts = async (req, res, next) => {
  try {
    const lowStockItems = await Product.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] },
    }).sort({ createdAt: 1 });

    res.status(200).json({
      count: lowStockItems.length,
      lowStockItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category-wise inventory summary using MongoDB Aggregation Pipeline
// @route   GET /api/products/summary
const getCategorySummary = async (req, res, next) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalStockValue: {
            $sum: { $multiply: ["$price", "$quantity"] },
          },
          avgPrice: { $avg: "$price" },
        },
      },
      {
        $project: {
          _id: 1,
          totalItems: 1,
          totalQuantity: 1,
          totalStockValue: { $round: ["$totalStockValue", 2] },
          avgPrice: { $round: ["$avgPrice", 2] },
        },
      },
      {
        $sort: { totalStockValue: -1 },
      },
    ]);

    res.status(200).json({
      categories: summary.length,
      summary,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  adjustStock,
  deleteProduct,
  getLowStockProducts,
  getCategorySummary,
};
