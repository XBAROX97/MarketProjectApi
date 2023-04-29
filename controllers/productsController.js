const express = require("express");
const mongoose = require("mongoose");
const Products = require("../models/productsModel");
const boxes = require("../models/boxesModel");
const controller = express()
controller.use(express.json());
controller.use(express.urlencoded({ extended: false }));

//Get all products
const allProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.send(products);
  } catch (err) {
    res.json({ message: err });
  }
};

//Post products
const postProducts = async (req, res) => {
  const retail = req.body.retailPrice
  const productRetail = parseInt(retail);
  const priceOfProduct = productRetail + (retail * 0.2)

  const products = new Products({

    name: req.body.name,

    price: priceOfProduct,

    category: req.body.category,

    quantityInPieces: req.body.quantityInPieces,

    quantityInBoxes: req.body.quantityInBoxes,

    totalNumberOfPieces: 0,

    retailPrice: req.body.retailPrice,

    Image: req.body.Image,

    serialNumber: req.body.serialNumber,

    originalQuantityInPieces: req.body.originalQuantityInPieces
  });


  try {
    const savedProducts = await products.save();
    res.status(200).json(savedProducts);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

//Get 1 product
const get1Product = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

//Delete products
const deleteProduct = async (req, res) => {

  await boxes.deleteOne({ productId: req.params.id });
  const removedProducts = await Products.deleteOne({ _id: req.params.id });
  res.status(200).json(removedProducts);

  console.log(`${removedProducts.deletedCount} product(s) have been deleted`);
};

//Update Products
const updateProducts = async (req, res) => {
  try {
    const updatedProduct = await Products.updateOne(
      { _id: req.params.id },
      {
        $set: {

          name: req.body.name,


          category: req.body.category,

          quantityInPieces: req.body.quantityInPieces,

          quantityInBoxes: req.body.quantityInBoxes,

          retailPrice: req.body.retailPrice,

          Image: req.body.Image,

          serialNumber: req.body.serialNumber,

          originalQuantityInPieces: req.body.originalQuantityInPieces
        },
      }
    );
    res.json(updatedProduct);
    console.log(`${updatedProduct.modifiedCount} Product(s) has been updated`);
  } catch (err) {
    res.json({ message: err });
  }
}



module.exports = {
  allProducts,
  postProducts,
  get1Product,
  deleteProduct,
  updateProducts,

};
