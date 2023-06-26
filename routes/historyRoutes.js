const express = require("express");
const router = express();
const { purchaseHistory } = require("../controllers/historyController");

//Get purchaseProduct history
router.get('/:userId',purchaseHistory)

module.exports = router;
