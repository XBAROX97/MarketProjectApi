const express = require("express");
const mongoose = require("mongoose");
const Users = require("../models/usersModel");
const Product = require("../models/productsModel");
const Purchase = require("../models/purchaseModel.js");
const Debt = require("../models/debtModel");
const Profits = require("../models/profitsModel");
const boxes = require('../models/boxesModel');
const { initQuantity } = require("./boxesController");


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
      const savedPurchases = await purchase.save()

      res.status(201).json(savedPurchases);

      await user.save();
      await calculateMonthlyProfit()
    } else {
      const purchase = new Purchase({
        user: userId,
        product: productId,
        quantity: req.body.quantity,
        totalCost,
      });
      const savedPurchases = await purchase.save()

      res.status(201).json(savedPurchases);

      await user.save();
      await calculateMonthlyProfit()

    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//Get all purchases
const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find();
    console.log(purchases)
    res.status(200).json(purchases);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

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


module.exports = { PurchaseController, getPurchases, calculateMonthlyProfit };

