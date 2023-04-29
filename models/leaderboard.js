const mongoose = require('mongoose')


const leaderSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique: true,
        required: true


    },
    userName: {
        type: String,

    },

    points: {
        type: Number,
        default: 0

    },

    position: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now()
    }

})


module.exports = mongoose.model('LeaderBoard', leaderSchema)
