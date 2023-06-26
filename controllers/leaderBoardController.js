const leaderboard = require('../models/leaderboard')
const user = require('../models/usersModel')

//Get all leaderboard points

const getPoints = async (req, res) => {
  try {
    const points = await leaderboard.find()
    res.status(200).json(points)

  } catch (err) {
    res.status(400).json({ message: err })
  }
}


module.exports = { getPoints };