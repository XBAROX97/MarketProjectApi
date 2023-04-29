const express = require('express')
const Product = require('../models/productsModel')
const boxes = require('../models/boxesModel')

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


        // update the quantity of products in the Product model
        const product = await Product.findById(req.body.productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        product.quantityInPieces += req.body.productQuantity * req.body.quantity;

        await product.save();


        const savedBox = await box.save();

        res.status(201).json(savedBox);
    } catch (error) {
        console.error();
        res.status(500).json({ error: 'Internal server error', message: error });
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
//In the front the update box should be a counter

const updateBoxes = async (req, res) => {
    try {
        const boxe = await boxes.findById(req.params.id)
        const boxQty = req.body.quantity
        const productQty = req.body.productQuantity

        const box = await boxes.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    quantity: req.body.quantity,
                    name: req.body.name,
                    productQuantity: req.body.productQuantity,
                    price: req.body.price
                }
            },
            { new: true } // Return the updated document instead of the old one
        );

        if (req.body.productQuantity == null) {
            return res.status(400).json({ message: "Please insert number of products in the box!" });
        }
        if (req.body.productId == null) {
            return res.status(400).json({ message: "Please insert the product's id" });
        }

        if (req.body.quantity != null) {

            if (boxQty > boxe.quantity) {

                const product1 = await Product.findById(req.body.productId)
                const newProductQuantity = parseInt(productQty) + product1.quantityInPieces
                const product = await Product.findOneAndUpdate(
                    { _id: req.body.productId },
                    {
                        $set: {
                            quantityInPieces: newProductQuantity
                        }
                    },
                    { new: true })
                await product.save();
            }

            if (boxQty < boxe.quantity) {

                const product1 = await Product.findById(req.body.productId)
                const newProductQuantity = product1.quantityInPieces - parseInt(productQty)
                const product = await Product.findOneAndUpdate(
                    { _id: req.body.productId },
                    {
                        $set: {
                            quantityInPieces: newProductQuantity
                        }
                    },
                    { new: true })
                await product.save();

            }

            return res.status(200).json(box);

        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred while updating the box!" });
    }
}

// DELETE a box
const deleteBoxes = async (req, res) => {
    try {

        const box = await boxes.deleteOne({ productId: req.params.id });
        const removedProducts = await Product.deleteOne({ _id: req.params.id });
        res.status(200).json(box);

        console.log(`${removedProducts.deletedCount} product(s) have been deleted`);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = {

    postBoxes, getBoxes, updateBoxes, deleteBoxes, get1Box
}