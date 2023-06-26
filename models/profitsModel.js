const mongoose = require('mongoose');

const profitsSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    unique: true
  },
  totalProfit: {
    type: Number,
    required: true
  }
});
module.exports = mongoose.model('Profits', profitsSchema);
