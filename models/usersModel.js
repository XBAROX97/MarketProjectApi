const express = require('express')
const mongoose = require('mongoose')


const usersSchema = new mongoose.Schema({

name:{
    type:String,
    required:true
},

budget:{
    type:Number ,
    get: v => Math.round(v * 100) / 100, 
    set: v => Math.round(v * 100) / 100,
    
},

debt:{
    type:Number ,
    get: v => Math.round(v * 100) / 100, 
    set: v => Math.round(v * 100) / 100,
},

timeStamp:{
    type:Date,
    default: Date.now()
},


comments:{

    type:String,
    
},

position:{
    type:String
},

image:{type: String,
    match: /\.(jpg|jpeg|png|gif)$/
},



})

 module.exports = mongoose.model('Users', usersSchema);