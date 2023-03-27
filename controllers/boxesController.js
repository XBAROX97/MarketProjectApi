const express = require('express')
const Product = require('../models/productsModel')
const boxes = require('../models/boxesModel')
const mongoose = require('mongoose')
const bodyParser = require("body-parser");


//post products boxes
const postBoxes = async (req, res) => {
    try {
        const box = new boxes({
            quantity: req.body.quantity,
            productQuantity: req.body.productQuantity,
            price: req.body.price,
            name: req.body.name,
            productId: req.body.productId,
        });

        // const originalQuantityInPieces = req.body.originalQuantityInPieces;

        const savedBox = await box.save();


        // update the quantity of products in the Product model
        const product = await Product.findById(req.body.productId);
        product.totalNumberOfPieces += req.body.productQuantity * req.body.quantity;
        product.quantityInPieces = product.totalNumberOfPieces


        // product.originalQuantityInPieces = originalQuantityInPieces;
        await product.save();

        res.status(201).json(savedBox);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//Get products boxes
const getBoxes = async (req, res) => {
    try {
        const box = await boxes.find()
        res.status(200).json(box)
    } catch (err) {
        res.status(400).json({
            message: err
        })
    }
}

//Get 1 box
const get1Box = async (req, res) => {
    try {
        const box = await boxes.findById(req.params.id)
        res.status(200).json(box)
    } catch (err) {
        res.status(400).json({
            message: err
        })
    }
}


//update boxes
const updateBoxes = async (req, res) => {
    try {
        const box = await boxes.updateOne({ _id: req.params.id }, {
            $set: {
                quantity: req.body.quantity,
                name: req.body.name,
                productQuantity: req.body.productQuantity,
                price: req.body.price
            }
        })

        if (req.body.productQuantity != null) {
            const oldQuantity = res.boxes.productQuantity;
            res.boxes.productQuantity = req.body.productQuantity;
            // update the quantity of products in the Product model
            const product = await Product.findById(res.boxes.productId);
            product.totalNumberOfPieces += (req.body.productQuantity - oldQuantity);
            product.quantityInPieces = product.totalNumberOfPieces;
            await product.save();
        }

        res.status(200).json(box)
        console.log(`${box.modifiedCount} box(s) have been updated `)

    } catch (err) {
        res.status(400).json({ message: err })
    }
}

// DELETE a box
const deleteBoxes = async (req, res) => {
    try {
        // Find the box to be deleted
        const box = await boxes.findOneAndDelete({ _id: req.params.id });

        // If the box is found, update the associated product's quantity
        if (box) {
            const product = await Product.findOneAndUpdate(
                { _id: box.productId },
                { $inc: { quantityInPieces: -box.productQuantity } },
                { new: true }
            );
            
            console.log(`Box ${req.params.id} has been deleted, and ${box.productQuantity} pieces of product ${product.name} have been removed`);
            res.status(200).json(box);
        } else {
            // If the box is not found, return a 404 status code
            res.status(404).json({ message: 'Box not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



module.exports = {
    
    postBoxes, getBoxes, updateBoxes, deleteBoxes, get1Box
}