const express = require("express");
const Users = require("../models/usersModel");
const controller = express();
controller.use(express.json());
controller.use(express.urlencoded({ extended: false }));
const ArchivedUser = require("../models/archivedUsers");
const Purchase = require("../models/purchaseModel");
const archivedUsers = require("../models/archivedUsers");
//Get all users
const getUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

//Post Users
const postUsers = async (req, res) => {
  const users = new Users({
    name: req.body.name,

    position: req.body.position,

    budget: req.body.budget,

    debt: req.body.debt,

    comments: req.body.comments,

    image: req.body.image,

    timeStamp: req.body.timeStamp,
  });

  try {
    const savedUsers = await users.save();
    res.status(200).json(savedUsers);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

//Get 1 user
const get1User = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

const deleteUser = async (req, res) => {
  try {
    // Find the user to be deleted
    const user = await Users.findById(req.params.id);
    if (!user) {
      throw new Error("User not found");
    }

    // Find all purchases made by the user
    const purchases = await Purchase.find({ user: req.params.id });
    
    // Archive the user's purchase history
    for (const purchase of purchases) {
      const archivedUser = new ArchivedUser({
        username: user.name,
      });
      await archivedUser.save();
      purchase.archivedUser = archivedUser._id;
      await purchase.save();
  
    }
    
    // Delete the user
    await Users.deleteOne({ _id: req.params.id });

    // Send a response to the client
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Update Users
const updateUsers = async (req, res) => {
  try {
    const updatedUsers = await Users.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          budget: req.body.budget,
          debt: req.body.debt,
          position: req.body.position,
          image: req.body.image,
          comments: req.body.comments,
        },
      }
    );
    res.status(200).json(updatedUsers);
    console.log(`${updatedUsers.modifiedCount} user(s) have been updated`);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

module.exports = {
  getUsers,
  postUsers,
  get1User,
  deleteUser,
  updateUsers,
};
