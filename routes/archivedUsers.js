const express = require('express')
const router = express()
const {getArchivedUsers} = require('../controllers/userController')

router.get('/',getArchivedUsers)


module.exports = router;