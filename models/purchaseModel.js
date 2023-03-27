// models/Purchase.js

const mongoose = require("mongoose");
const User = require("../models/usersModel");
const Product = require("../models/productsModel");

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
   type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: { type: Number },
  totalCost: { type: Number },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Purchase", purchaseSchema);
