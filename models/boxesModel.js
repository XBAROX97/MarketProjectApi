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
    },

    originalQuantityInPieces:
    {
        type: Number,


    }

})

boxesSchema.pre('save', function (next) {
    if (this.isNew) {
        this.originalQuantityInPieces = this.productQuantity * this.quantity;
    }
    next();
});



module.exports = mongoose.model('boxes', boxesSchema);
