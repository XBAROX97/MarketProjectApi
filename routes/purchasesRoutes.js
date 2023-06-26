const express = require("express");
const router = express();
const { PurchaseController,getAllPurchases } = require("../controllers/purchaseController");

//Post purchases
router.post("/", PurchaseController);

//Get all purchases
router.get('/',getAllPurchases)

module.exports = router;
