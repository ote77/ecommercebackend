const express = require('express');
const router = express.Router();
const Items = require('../models/items');

//get back an item by id.
router.get('/:itemId', async (req, res) => {
  try {
    const items = await Items.findById(req.params.itemId);
    res.json(items);
    // console.log(items);
  } catch (err) {
    res
      .status(404)
      .json({
        success: false,
        message: 'Item could not be found'
      });
  }
});

//modify a item
router.patch('/:itemId', async (req, res) => {
  console.log('patch');
  try {
    const modifiedItem = await Items.findByIdAndUpdate(req.params.itemId, {
      $set: {
        ...req.body
      }
    });
    res.json(modifiedItem);
  } catch (err) {
    res.json({
      message: err
    });
  }
});

router.delete('/:itemId', async (req, res) => {
  try {
    const removedItem = await Items.remove({
      _id: req.params.itemId
    });
    res.json(removedItem);
  } catch (err) {
    res.json({
      message: err
    });
  }
});

module.exports = router;
