const express = require('express');
const router = express.Router();
const Items = require('../models/items');

const adminauth = require('../middleware/adminauth');

//get back an item by id.
router.get('/:itemId', async (req, res) => {
  try {
    const items = await Items.findOne({_id:req.params.itemId,status:"sale"});
    console.log(items);
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

//submit a item.
router.post('/', adminauth, async (req, res) => {
  const id = await nextId();
  const items = new Items({
    _id: id,
    ...req.body
  });
  try {
    const newItem = await items.save();
    res.status(201).json({
      success: true,
      message: 'New items added'
    });
    console.log('ITEM-[%s] %s added', items._id, items.name);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err
    });
  }
});


//modify a item, admin auth
router.patch('/:itemId', adminauth, async (req, res) => {
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

router.delete('/:itemId', adminauth, async (req, res) => {
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
