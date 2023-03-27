const express = require('express')
const mongoose = require('mongoose');

const DebtSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Debt = mongoose.model('Debt', DebtSchema);

module.exports = Debt;
