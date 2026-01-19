const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const {
  buildSafeQuery,
  sanitizeQueryParams,
  isValidObjectId,
  sanitizeInput,
} = require("../utils/validation");

// @desc    Fetch all products with filtering and pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  // Sanitize query parameters to prevent NoSQL injection
  const sanitizedQuery = sanitizeQueryParams(req.query);

  // Build safe query using the validation utility
  const query = buildSafeQuery(sanitizedQuery);

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // Validate the product ID to prevent NoSQL injection
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  // Validate the product ID to prevent NoSQL injection
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // Validate required fields
  const { name, price, image, brand, category, description, countInStock } =
    req.body;

  if (!name || !price || !image || !brand || !category || !description) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Validate numeric fields
  if (isNaN(price) || price < 0) {
    res.status(400);
    throw new Error("Price must be a positive number");
  }

  if (isNaN(countInStock) || countInStock < 0) {
    res.status(400);
    throw new Error("Stock count must be a positive number");
  }

  const product = new Product({
    name: sanitizeInput(name),
    price: Number(price),
    user: req.user._id,
    image: sanitizeInput(image),
    brand: sanitizeInput(brand),
    category: sanitizeInput(category),
    countInStock: Number(countInStock),
    numReviews: 0,
    description: sanitizeInput(description),
    images: Array.isArray(req.body.images)
      ? req.body.images.map((img) => sanitizeInput(img))
      : [],
    variations: Array.isArray(req.body.variations) ? req.body.variations : [],
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  // Validate the product ID to prevent NoSQL injection
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    // Update only provided fields
    const { name, price, description, image, brand, category, countInStock } =
      req.body;

    if (name !== undefined) product.name = sanitizeInput(name);
    if (price !== undefined) {
      if (isNaN(price) || price < 0) {
        res.status(400);
        throw new Error("Price must be a positive number");
      }
      product.price = Number(price);
    }
    if (description !== undefined)
      product.description = sanitizeInput(description);
    if (image !== undefined) product.image = sanitizeInput(image);
    if (req.body.images !== undefined) {
      product.images = Array.isArray(req.body.images)
        ? req.body.images.map((img) => sanitizeInput(img))
        : product.images;
    }
    if (brand !== undefined) product.brand = sanitizeInput(brand);
    if (category !== undefined) product.category = sanitizeInput(category);
    if (countInStock !== undefined) {
      if (isNaN(countInStock) || countInStock < 0) {
        res.status(400);
        throw new Error("Stock count must be a positive number");
      }
      product.countInStock = Number(countInStock);
    }
    if (req.body.variations !== undefined) {
      product.variations = Array.isArray(req.body.variations)
        ? req.body.variations
        : product.variations;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  // Validate required fields
  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("Rating is required and must be between 1 and 5");
  }

  // Validate the product ID to prevent NoSQL injection
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment: comment || "", // Make comment optional, default to empty string
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete user review
// @route   DELETE /api/products/:id/reviews
// @access  Private
const deleteProductReview = asyncHandler(async (req, res) => {
  // Validate the product ID to prevent NoSQL injection
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    const reviewIndex = product.reviews.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (reviewIndex === -1) {
      res.status(404);
      throw new Error("Review not found");
    }

    product.reviews.splice(reviewIndex, 1);
    product.numReviews = product.reviews.length;

    if (product.reviews.length > 0) {
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();
    res.status(200).json({ message: "Review removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Update user review
// @route   PUT /api/products/:id/reviews
// @access  Private
const updateProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  // Validate required fields
  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("Rating is required and must be between 1 and 5");
  }

  // Validate the product ID to prevent NoSQL injection
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    const review = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (review) {
      review.rating = Number(rating);
      review.comment = comment || review.comment; // Update comment only if provided, otherwise keep existing
      review.name = req.user.name; // Update name in case user changed it

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(200).json({ message: "Review updated" });
    } else {
      res.status(404);
      throw new Error("Review not found");
    }
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

// @desc    Get product suggestions
// @route   GET /api/products/suggestions?query=xyz
// @access  Public
const getProductSuggestions = asyncHandler(async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.json([]);
  }

  // Sanitize the query parameter to prevent NoSQL injection
  const sanitizedQuery = sanitizeInput(query);

  // Find products by name or category matching the query, limit to 5
  const products = await Product.find({
    $or: [
      { name: { $regex: sanitizedQuery, $options: "i" } },
      { category: { $regex: sanitizedQuery, $options: "i" } },
    ],
  })
    .select("name image price category _id")
    .limit(5);

  res.json(products);
});

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  deleteProductReview,
  updateProductReview,
  getTopProducts,
  getProductSuggestions,
};
