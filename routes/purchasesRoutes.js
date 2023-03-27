const express = require("express");
const router = express();
const { PurchaseController,getPurchases } = require("../controllers/purchaseController");

//Post purchases
router.post("/", PurchaseController);

//Get all purchases
router.get('/',getPurchases)


module.exports = router;
