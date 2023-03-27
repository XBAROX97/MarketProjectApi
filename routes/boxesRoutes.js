const express = require('express')
const { postBoxes, get1Box, getBoxes, deleteBoxes, updateBoxes } = require('../controllers/boxesController')
const router = express()


//Get all boxes
router.get("/", getBoxes);

//Post boxes
router.post("/", postBoxes);

//Get 1 box
router.get('/:id', get1Box);

//Delete boxes
router.delete('/:id', deleteBoxes)

//Update boxes
router.patch('/:id', updateBoxes)

module.exports = router;
