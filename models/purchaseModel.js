
const mongoose = require("mongoose");


const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  archivedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ArchivedUser"
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
