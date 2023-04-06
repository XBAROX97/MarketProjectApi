const mongoose = require('mongoose')


const leaderSchema = new mongoose.Schema({

Users:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},

points:{
    type:Number,
    default:0
    
},

date:{
    type:Date,
    default:Date.now()
}

})


module.exports = mongoose.model('LeaderBoard',leaderSchema)
