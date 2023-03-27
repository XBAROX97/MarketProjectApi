const express = require("express");
const mongoose = require("mongoose");
const router = express();

const { getUsers, postUsers,get1User,deleteUsers,updateUsers } = require("../controllers/userController");

//Get all users
router.get("/", getUsers);

//Post Users
router.post("/", postUsers);

//Get 1 user
router.get('/:id',get1User);

//Delete users
router.delete('/:id',deleteUsers)

//Update users
router.patch('/:id', updateUsers)

module.exports = router;
