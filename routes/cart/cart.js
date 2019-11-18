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
    const cart = req.body;
    user.cart = cart;
    user.save();
    res.status(200).json({
      success: true,
      message: 'Successfully add to cart'
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
      message: items
    });
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.json({
      message: err
    });
  }
});

// router.get('/', async (req, res) => {
//   try {
//     console.log('<------ user ------>\n', user);
//
//     // console.log(items);
//   } catch (err) {
//     res
//       .status(404)
//       .json({
//         success: false,
//         message: 'Item could not be found'
//       });
//   }
// });
module.exports = router;
