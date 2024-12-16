const Product = require("../models/Product");

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  const {
    name,
    price,
    description,
    countInStock,
    imageUrl,
    category,
    rating,
    numReviews,
  } = req.body;

  if (
    !name ||
    !price ||
    !description ||
    !countInStock ||
    !imageUrl ||
    !category ||
    !rating ||
    !numReviews
  ) {
    console.log("Create Product Missing Fields:", req.body);
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const product = await Product.create({
      name,
      price,
      description,
      countInStock,
      imageUrl,
      category,
      rating,
      numReviews,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
