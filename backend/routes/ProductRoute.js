const express = require("express");
const router = express.Router();
const { upload } = require("../utils/fileUpload");
const protector = require("../middleware/protector");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

// create product
router.post(
  "/api/createProduct",
  protector,
  upload.single("image"),
  createProduct
);

// get all  products
router.get("/api/getProducts", protector, getAllProducts);

// get single  product
router.get("/api/getProduct/:id", protector, getSingleProduct);

// delete product
router.delete("/api/deleteProduct/:id", protector, deleteProduct);

// update product
router.patch(
  "/api/updateProduct/:id",
  protector,
  upload.single("image"),
  updateProduct
);

module.exports = router;
