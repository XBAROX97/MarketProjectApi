const express = require('express')
const router = express()
const {getPoints} = require('../controllers/leaderBoardController')

router.get('/',getPoints)

module.exports = router