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


        // const originalQuantityInPieces = req.body.originalQuantityInPieces;

        const savedBox = await box.save();

        // update the quantity of products in the Product model
        const product = await Product.findById(req.body.productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        product.quantityInPieces += req.body.productQuantity * req.body.quantity;
        // product.quantityInPieces = product.totalNumberOfPieces


        // product.originalQuantityInPieces = originalQuantityInPieces;
        await product.save();

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

const updateBoxes = async (req, res) => {
    try {
        const boxe = await boxes.findById(req.params.id)
       
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

                const product1 = await Product.findById(req.body.productId)
                const newProductQuantity = (req.body.productQuantity * req.body.quantity) - product1.purchases
                const product = await Product.findOneAndUpdate(
                    { _id: req.body.productId },
                    {
                        $set: {
                            quantityInPieces: newProductQuantity
                        }
                    },
                    { new: true })
                await product.save();
        
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
        // Find the box to be deleted
        const box1 = await boxes.findById({ _id: req.params.id });

        // If the box is found, update the associated product's quantity
        if (box1) {
            const product = await Product.findOneAndUpdate(
                { _id: box1.productId },
                { $inc: { quantityInPieces: - ((box1.productQuantity) * (box1.quantity)) } },
            
            );

            await product.save()

            const box = await boxes.deleteOne({ _id: req.params.id })

            console.log(`Box ${box1.name} has been deleted, and ${box1.productQuantity} pieces of product ${product.name} have been removed`);
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