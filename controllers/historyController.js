// const User = require("../models/usersModel");
const purchases = require("../models/purchaseModel");



//Purchase product History
const purchaseHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId);
        const purchaseForUser = await purchases.find({ user: userId })
        console.log(purchaseForUser);

        res.status(200).json(purchaseForUser);
    }
    catch (error) {
        console.log(error);
    }
}
module.exports = { purchaseHistory };