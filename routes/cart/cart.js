const express = require('express');
const router = express.Router();
const User = require('../../models/users');
const auth = require('../../middleware/auth');
const {
  itemList
} = require('../../utils/itemMethods');

router.post('/', auth, async (req, res) => {
  try {
    // console.log('<------ req.body ------>\n', req.body);
    const user = await User.findOne({"username":req.user.username});
    user.cart = req.body.cart;
    const items = await itemList(req.body.cart);
    user.save();
    res.status(200).json({
      success: true,
      cart: items
    });
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.json({
      message: err
    });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    // console.log('<------ req.body ------>\n', req.body);
    const user = await User.findOne({"username":req.user.username});
    const items = await itemList(user.cart);
    res.status(200).json({
      success: true,
      cart: items
    });
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.json({
      message: err
    });
  }
});
module.exports = router;
