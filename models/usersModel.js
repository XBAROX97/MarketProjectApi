const express = require('express')
const mongoose = require('mongoose')


const usersSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    budget: {
        type: Number,


    },

    debt: {
        type: Number,

    },

    timeStamp: {
        type: Date,
        default: Date.now()
    },


    comments: {

        type: String,

    },

    position: {
        type: String
    },

    image: {
        type: String,
        match: /\.(jpg|jpeg|png|gif)$/
    },
    
    points:{
        type: Number,
        default:0
    }



})

module.exports = mongoose.model('Users', usersSchema);