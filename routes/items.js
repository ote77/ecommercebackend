const express = require('express');
const router = express.Router();
const Items = require('../models/items');
const ItemsId = require('../models/itemsId');
const {
  nextId
} = require('../jss/addid');

//get back item lists.
router.get('/', async (req, res) => {
  try {
    const items = await Items.find({}, 'name price stock');
    res.json(items);
  } catch (err) {
    res.json({
      message: err
    });
  }
});

//submit a item.
router.post('/', async (req, res) => {
  const id = await nextId();
  const items = new Items({
    _id: id,
    ...req.body
  });
  try {
    const newItem = await items.save();
    res.json(newItem);
    console.log('ITEM-[%s] %s added', items._id, items.name);
  } catch (err) {
    res.json({
      message: err
    });
  }
});


module.exports = router;