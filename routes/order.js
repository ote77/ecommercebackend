const express = require('express');
const router = express.Router();
const Items = require('../models/items');
const ItemsId = require('../models/itemsId');
const Order = require('../models/orders');
//get one order , update one order

//get back an order by id.
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    res.json(order);
  } catch (err) {
    res
      .status(404)
      .json({
        success: false,
        message: 'Order could not be found'
      });
  }
});

//set order to paid:true after paypal
router.patch('/:orderId', async (req, res) => {
  try {
    const modifiedOrder = await Order.findByIdAndUpdate(req.params.orderId, {
      $set: {
        paid: true
      }
    });
    // console.log(modifiedOrder);
    res.json(modifiedOrder);
  } catch (err) {
    res.json({
      message: err
    });
  }
});

module.exports = router;