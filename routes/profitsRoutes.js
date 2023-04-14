const express = require("express");
const router = express();
const {getAllProfits}= require('../controllers/purchaseController')

//Get Monthly Profits
router.get('/',getAllProfits)


module.exports = router