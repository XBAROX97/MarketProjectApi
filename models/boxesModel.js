const express = require('express')
const mongoose = require('mongoose')


const boxesSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    productQuantity: {
        type: Number,
        required: true
    },

    price: {
        type: Number
    },

    productId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    }

})

// boxesSchema.pre('findOneAndDelete', async function (next) {
   
//     try {
//         // Get the product associated with the box
//         const product = await this.model('Products').findById(this.productId);

//         // Decrease the product quantity by the quantity in the box
//         product.quantityInPieces -= this.productQuantity;

//         // Save the updated product
//         await product.save();

//         // Move on to the next middleware
//         next();
//     } catch (error) {
//         // Handle the error
//         next(error);
//     }
// });



module.exports = mongoose.model('boxes', boxesSchema);
