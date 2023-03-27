const express = require("express");
const router = express();
const {calculateMonthlyProfit}= require('../controllers/purchaseController')

//Get Monthly Profits
router.get('/',calculateMonthlyProfit)


module.exports = router