const express = require('express');
const router = express.Router();
const Items = require('../models/items');
const {
  nextId
} = require('../jss/addid');

//get back item lists.
router.get('/', async (req, res) => {
  try {
    const items = await Items.find({status:'Sale'}, '-__v -status');
    res.status(200).json({
      success: true,
      items
    });
  } catch (err) {
    res.json({
      message: err
    });
  }
});

router.get('/:itemId', async (req, res) => {
  try {
    const items = await Items.findOne({_id:req.params.itemId,status:"Sale"},'-__v -status');
    if (items) {
      res.status(200).json({
        success: true,
        items
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Item could not be found'
      });
    }
  } catch (err) {
    res
      .status(404)
      .json({
        success: false,
        message: 'Item could not be found'
      });
  }
});

module.exports = router;
