const express = require("express");
const mongoose = require("mongoose");
const Products = require("../models/productsModel");
const bodyParser = require('body-parser')
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
  const products = new Products({
   
    name: req.body.name,

    price: req.body.price,

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
  try {
    const removedProducts = await Products.deleteOne({ _id: req.params.id });
    res.status(200).json(removedProducts);

    console.log(`${removedPosts.deletedCount} product(s) have been deleted`);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

//Update Products
const updateProducts = async(req,res)=>{
try {
  const updatedProduct = await Products.updateOne(
    { _id: req.params.id },
    {
      $set: {
        
        name: req.body.name,

        price: req.body.price,

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
}}



module.exports = {
  allProducts,
  postProducts,
  get1Product,
  deleteProduct,
  updateProducts,
 
};
