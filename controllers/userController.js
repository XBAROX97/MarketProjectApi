const express = require("express");
const mongoose = require("mongoose");
const Users = require("../models/usersModel");
const bodyParser = require("body-parser");
const controller = express()
controller.use(express.json());
controller.use(express.urlencoded({ extended: false }));

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

//Delete user
const deleteUsers = async (req, res) => {
  try {
    const deletedUser = await Users.deleteOne({ _id: req.params.id });
    res.status(200).json(deletedUser);
    console.log(`${deletedUser.deletedCount} user(s) have been deleted`);
  } catch (err) {
    res.status(400).json({ message: err });
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
  deleteUsers,
  updateUsers
};
