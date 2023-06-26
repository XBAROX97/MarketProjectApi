const express = require("express");
const router = express();
const {
  allProducts,
  postProducts,
  get1Product,
  deleteProduct,
  updateProducts,
} = require("../controllers/productsController");

//Get all products
router.get("/", allProducts);

//Get one product
router.get("/:id", get1Product);

//Post products
router.post("/", postProducts);

//Delete product
router.delete("/:id", deleteProduct);

//Update Products
router.patch("/:id", updateProducts);


module.exports = router;
