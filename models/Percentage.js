const mongoose = require('mongoose')


const ProfitpercentageSchema = new mongoose.Schema({

    percentage: {
        type: Number,
        required: true
    },

    
})

module.exports = mongoose.model('Profitpercentage', ProfitpercentageSchema)