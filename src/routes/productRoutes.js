const express = require("express");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const authenticateToken = require("../middlewares/authenticateToken");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.get("/", authenticateToken, getProducts);
router.post("/", [authenticateToken, isAdmin], createProduct);
router.put("/:id", [authenticateToken, isAdmin], updateProduct);
router.delete("/:id", [authenticateToken, isAdmin], deleteProduct);

module.exports = router;
