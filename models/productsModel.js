const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema({


    name: {
        type: String,
        required: true,
        unique: true

    },

    price: {
        type: Number,

    },
    category: {
        type: String,
        required: true,
    },

    quantityInPieces: {
        type: Number,

    },

    originalQuantityInPieces: {
        type: Number,
        
    

    },


    totalNumberOfPieces: {
        type: Number,
        
    },


    retailPrice: {
        type: Number,
        required: true,
    },


    Image: {
        type: String,
        match: /\.(jpg|jpeg|png|gif)$/,

    },

    serialNumber: {
        type: Number,
        required: true
    },

   purchases:{
    type:Number,
    default:0
   }
})

productsSchema.pre('save', function (next) {
    if (this.isNew) {
        this.originalQuantityInPieces = this.quantityInPieces;
    }
    next();
});




module.exports = mongoose.model('Products', productsSchema);