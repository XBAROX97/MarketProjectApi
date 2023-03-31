const Users = require("../models/usersModel");
const Product = require("../models/productsModel");
const Purchase = require("../models/purchaseModel.js");
const Debt = require("../models/debtModel");
const Profits = require("../models/profitsModel");


//Post purchases
const PurchaseController = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const user = await Users.findById(userId);
    const product = await Product.findById(productId);

    if (user == null || product == null) {
      return res.status(404).json({ message: "User or product not found" });
    }

    const totalCost = quantity * product.price;
    const remainingBudget = user.budget - totalCost;



    if (product.quantityInPieces < quantity) {
      return res.status(400).json({ message: "Not enough quantity" });
    }

    user.budget -= totalCost;

    product.quantityInPieces -= quantity;

    await user.save();
    await product.save();

    if (remainingBudget < 0) {
      const debt = new Debt({
        user: userId,
        amount: Math.abs(remainingBudget),
        date: new Date(),
      })

      const purchase = new Purchase({
        user: userId,
        product: productId,
        quantity: req.body.quantity,
        totalCost,
      });
      await debt.save();

      user.debt += debt.amount;
      user.budget = 0;

      await purchase.save()
      const response = {
        id: purchase._id,
        user: {
          id: userId,
          name: user.name
        },
        product: {
          id: productId,
          name: product.name
        },
        quantity,
        totalCost
      };

      res.status(201).json(response);

      await user.save();
      await calculateMonthlyProfit()
    } else {
      const purchase = new Purchase({
        user: userId,
        product: productId,
        quantity: req.body.quantity,
        totalCost,
      });


      await purchase.save()

      const response = {
        id: purchase._id,
        user: {
          id: userId,
          name: user.name
        },
        product: {
          id: productId,
          name: product.name
        },
        quantity,
        totalCost
      };


      res.status(201).json(response);

      await user.save();
      await calculateMonthlyProfit()

    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//Get all purchases
const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({});
    const response = [];
    for (const purchase of purchases) {
      const user = await Users.findById(purchase.user);
      const product = await Product.findById(purchase.product);
      if (!user || !product) {
        continue;
      }
      const purchaseData = {
        id: purchase._id,
        user: {
          id: purchase.user,
          name: user.name
        },
        product: {
          id: purchase.product,
          name: product.name
        },
        quantity: purchase.quantity,
        totalCost: purchase.totalCost
      };
      response.push(purchaseData);
    }
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}




//Calculate monthly profits

const calculateMonthlyProfit = async () => {

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
  });

  const products = await Product.find();

  var totalProfit = 0;


  for (const product of products) {
    const profit = Number(product.price) - Number(product.retailPrice);
    const quantitySold = Number(product.totalNumberOfPieces) - Number(product.quantityInPieces);
    if (isNaN(profit) || isNaN(quantitySold)) {
      continue;
    } else {
      totalProfit += profit * quantitySold;
    }
  }


  const profits = await Profits.findOneAndUpdate(
    { month: currentMonth },
    { $set: { totalProfit: totalProfit } },
    { new: true, upsert: true }
  );

  return profits


};


module.exports = { PurchaseController, getAllPurchases, calculateMonthlyProfit };

