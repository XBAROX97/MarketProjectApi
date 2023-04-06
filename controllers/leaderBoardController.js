
const Users = require('../models/usersModel')


const LeaderboardController = async (req, res) => {
    try {
      const leaderboard = await Users.aggregate([
        {
          $lookup: {
            from: "points",
            localField: "_id",
            foreignField: "user",
            as: "points",
          },
        },
        {
          $project: {
            name: 1,
            points: { $sum: "$points.amount" },
          },
        },
        {
          $sort: {
            points: -1,
          },
        },
      ]);
  
      res.status(200).json(leaderboard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  

module.exports = LeaderboardController;