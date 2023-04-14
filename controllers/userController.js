const express = require("express");
const Users = require("../models/usersModel");
const controller = express()
controller.use(express.json());
controller.use(express.urlencoded({ extended: false }));
const ArchivedUser = require('../models/archivedUsers')

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
  const userId = req.params.id;

  try {
    // find the user to delete
    const userToDelete = await Users.findById(userId);

    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    // insert the user into the archived collection
    const archivedUser = new ArchivedUser({
      username: userToDelete.name,
    });
    await archivedUser.save();

    // remove the user from the original collection
    await Users.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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
