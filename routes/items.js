const express = require('express');
const router = express.Router();
const Items = require('../models/items');
const {
  nextId
} = require('../jss/addid');
const adminauth = require('../middleware/adminauth');

//get back item lists.
router.get('/', async (req, res) => {
  try {
    const items = await Items.find({}, 'name price stock description');
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


module.exports = router;
