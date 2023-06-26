const Users = require("../models/usersModel");
const Product = require("../models/productsModel");
const Purchase = require("../models/purchaseModel.js");
const Debt = require("../models/debtModel");
const Profits = require("../models/profitsModel");
const archivedUser = require("../models/archivedUsers");
const leaderboard = require("../models/leaderboard");
const boxes = require("../models/boxesModel");

//Post Purchases
const PurchaseController = async (req, res) => {
  // try {
  const { userId, productId, quantity } = req.body;
  const user = await Users.findById(userId);
  const product = await Product.findById(productId);
  const box = await boxes.findOne({ productId: productId });

  if (user == null || product == null) {
    return res.status(404).json({ message: "User or product not found" });
  }

  const totalCost = quantity * product.price;
  const remainingBudget = user.budget - totalCost;

  if (product.quantityInPieces < quantity) {
    return res.status(400).json({ message: "Not enough quantity" });
  }
  const Budget = user.budget - totalCost;
  user.budget = Budget.toFixed(2);

  let proPurchase = parseInt(product.purchases);
  product.quantityInPieces -= quantity;
  proPurchase += parseInt(quantity);
  product.purchases = parseInt(proPurchase);
  await product.save(); // Save product first

  if (remainingBudget < 0) {
    const debt = new Debt({
      user: userId,
      amount: Math.abs(remainingBudget),
      date: new Date()
    });

    const purchase = new Purchase({
      user: userId,
      product: productId,
      quantity: req.body.quantity,
      totalCost,
      purchaseDate: new Date()
    });
    await debt.save();
    const newDebt = user.debt + debt.amount;
    user.debt = newDebt.toFixed(2);
    user.budget = 0;

    user.points += 5;

    await purchase.save();
    const response = {
      id: purchase._id,
      user: {
        id: userId,
        name: user.name,
        points: user.points
      },
      product: {
        id: productId,
        name: product.name
      },
      quantity,
      totalCost
    };

    await user.save();
    res.status(201).json(response);

    var Leaderboard = await leaderboard.findOne({ userId: userId });
    Leaderboard.points += 5;

    await Leaderboard.save();

    await calculateMonthlyProfit();
  } else {
    const purchase = new Purchase({
      user: userId,
      product: productId,
      quantity: req.body.quantity,
      totalCost,
      purchaseDate: new Date()
    });

    user.points += 10; // Update user points

    await purchase.save();

    const response = {
      id: purchase._id,
      user: {
        id: userId,
        name: user.name,
        points: user.points
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

    var Leaderboard = await leaderboard.findOne({ userId: userId });
    Leaderboard.points += 10;

    await Leaderboard.save();

    await calculateMonthlyProfit();
    const productsInBox = box.productQuantity;

    if (product && product.purchases) {
      const nbOfPurchases = product.purchases;
      if (nbOfPurchases % productsInBox === 0) {
        box.quantity -= 1;
        await box.save();
      }
    }
  }
  // } catch (err) {
  //   res.json({ message: err })
  // }
};

//Get all Purchases
const getAllPurchases = async (req, res) => {
  try {
    const archivedUsers = await archivedUser.find({});

    let archivedPurchases = [];
    for (const archivedUser of archivedUsers) {
      // Fetch all purchases made by the current archived user
      const purchases = await Purchase.find({ archivedUser: archivedUser.id });
      for (const purchase of purchases) {
        const product = await Product.findById(purchase.product);

        if (!archivedUsers || !product) {
          continue;
        }

        const purchaseData = {
          id: purchase._id,
          archivedUser: {
            id: purchase.archivedUser,
            name: archivedUser.username
          },
          product: {
            id: purchase.product,
            name: product.name
          },
          quantity: purchase.quantity,
          totalCost: purchase.totalCost,
          purchaseDate: purchase.purchaseDate
        };
        archivedPurchases.push(purchaseData);
      }
    }
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
          name: user.name,
          points: user.points
        },
        product: {
          id: purchase.product,
          name: product.name
        },
        quantity: purchase.quantity,
        totalCost: purchase.totalCost,
        purchaseDate: purchase.purchaseDate
      };
      response.push(purchaseData);
    }
    const allPurchases = [archivedPurchases, response];
    res.json(allPurchases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Calculate monthly profits
const calculateMonthlyProfit = async () => {
  const currentMonth = new Date().toLocaleString("default", {
    month: "long"
  });

  const products = await Product.find();

  let totalProfit = 0;

  for (const product of products) {
    const profit = Number(product.price) - Number(product.retailPrice);

    const quantitySold = product.purchases;
    console.log(quantitySold);

    totalProfit += profit * quantitySold;
    console.log(totalProfit);
  }

  try {
    // Find the profits document for the current month
    let profits = await Profits.findOne({ month: currentMonth });

    if (profits) {
      // If the document exists, update the totalProfit field
      profits.totalProfit = totalProfit;
      await profits.save();
    } else {
      // If the document does not exist, create a new document
      profits = new Profits({ month: currentMonth, totalProfit: totalProfit });
      await profits.save();
    }

    return profits;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to calculate monthly profit");
  }
};

//Get all profits
const getAllProfits = async (req, res) => {
  try {
    const profits = await Profits.find();
    res.status(200).json(profits);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

module.exports = { PurchaseController, getAllPurchases, getAllProfits };
