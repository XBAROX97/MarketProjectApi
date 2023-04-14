const Users = require("../models/usersModel");
const Product = require("../models/productsModel");
const Purchase = require("../models/purchaseModel.js");
const Debt = require("../models/debtModel");
const Profits = require("../models/profitsModel");
const leaderBoard = require("../models/leaderboard");
const LeaderboardController = require("./leaderBoardController");
const archivedUser = require("../models/archivedUsers");
const profits = require("../models/profitsModel");

const PurchaseController = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const profit = await profits.find();

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

    await product.save(); // Save product first

    if (remainingBudget < 0) {
      const debt = new Debt({
        user: userId,
        amount: Math.abs(remainingBudget),
        date: new Date(),
      });

      const purchase = new Purchase({
        user: userId,
        product: productId,
        quantity: req.body.quantity,
        totalCost,
      });
      await debt.save();

      user.debt += debt.amount;
      user.budget = 0;

      user.points += 5; // Update user points

      // ard = await leaderBoard.findOne({ user: userId });
      // if (leaderBoard) {
      //   leaderBoard.points += 5;
      //   await leaderBoard.save();
      // } else {
      //   const newLeaderboard = new leaderBoard({ user: userId, points: 5 });
      //   await newLeaderboard.save();
      // }

      await purchase.save();
      const response = {
        id: purchase._id,
        user: {
          id: userId,
          name: user.name,
          points: user.points,
        },
        product: {
          id: productId,
          name: product.name,
        },
        quantity,
        totalCost,
      };

      await user.save();
      res.status(201).json(response);

      await calculateMonthlyProfit();
    } else {
      const purchase = new Purchase({
        user: userId,
        product: productId,
        quantity: req.body.quantity,
        totalCost,
        profit,
      });

      user.points += 10; // Update user points
      // ard = await leaderBoard.findOne({ user: userId });
      // if (leaderBoard) {
      //   leaderBoard.points += 10;
      //   await leaderBoard.save();
      // } else {
      //   const newLeaderboard = new leaderBoard({ user: userId, points: 5 });
      //   await newLeaderboard.save();
      // }

      await purchase.save();

      const response = {
        id: purchase._id,
        user: {
          id: userId,
          name: user.name,
          points: user.points,
        },
        product: {
          id: productId,
          name: product.name,
        },
        quantity,
        totalCost,
        profit,
      };

      res.status(201).json(response);

      await user.save();
      await calculateMonthlyProfit();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPurchases = async (req, res) => {
  try {
    // Fetch all archived users
    const archivedUsers = await archivedUser.find({});

    // Array to store all purchases made by archived users
    let archivedPurchases = [];

    // Loop through all archived users
    for (const user of archivedUsers) {
      // Fetch all purchases made by the current archived user
      const purchases = await Purchase.find({ user: user.id });

      // Loop through all purchases made by the current archived user
      for (const purchase of purchases) {
        // Fetch the user and product details for the current purchase
        const user = await Users.findById(purchase.user);
        const product = await Product.findById(purchase.product);

        // If the user or product cannot be found, skip the current purchase
        if (!user || !product) {
          continue;
        }

        // Add the purchase data to the archivedPurchases array
        const purchaseData = {
          id: purchase._id,
          archivedUser: {
            id: purchase.archivedUser,
            name: archivedUsers.username,
          },
          product: {
            id: purchase.product,
            name: product.name,
          },
          quantity: purchase.quantity,
          totalCost: purchase.totalCost,
        };
        archivedPurchases.push(purchaseData);
      }
    }

    // Fetch all purchases made by active users
    const purchases = await Purchase.find({});
    const response = [];

    console.log(archivedPurchases);

    // Loop through all purchases made by active users
    for (const purchase of purchases) {
      // Fetch the user and product details for the current purchase
      const user = await Users.findById(purchase.user);
      const product = await Product.findById(purchase.product);

      // If the user or product cannot be found, skip the current purchase
      if (!user || !product) {
        continue;
      }

      // Add the purchase data to the response array
      const purchaseData = {
        id: purchase._id,
        user: {
          id: purchase.user,
          name: user.name,
          points: user.points,
        },
        product: {
          id: purchase.product,
          name: product.name,
        },
        quantity: purchase.quantity,
        totalCost: purchase.totalCost,
      };
      response.push(purchaseData);
    }

    // Combine the purchase history of active and archived users into a single response
    const allPurchases = response.concat(archivedPurchases);
    res.json(allPurchases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Calculate monthly profits

const calculateMonthlyProfit = async () => {
  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
  });

  const products = await Product.find();

  let totalProfit = 0;

  for (const product of products) {
    const profit = Number(product.price) - Number(product.retailPrice);
    const quantitySold =
      Number(product.totalNumberOfPieces) - Number(product.quantityInPieces);
    if (isNaN(profit) || isNaN(quantitySold)) {
      continue;
    } else {
      totalProfit += profit * quantitySold;
    }
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
