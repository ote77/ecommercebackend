const express = require('express');
const router = express.Router();
const Items = require('../models/items');
const ItemsId = require('../models/itemsId');
const Order = require('../models/orders');
const {
  createOrder
} = require('../jss/createOrder');
//for post orders and get orders

//get back orders.
router.get('/', async (req, res) => {
  try {
    const order = await Order.find();
    res.json(order);
    // console.log(items);
  } catch (err) {
    res
      .status(404)
      .json({
        success: false,
        message: 'Order could not be found'
      });
  }
});

//post a new order

router.post('/', async (req, res) => {
  //check stocks here by order.items[i]: a function createOrder. return (err,order)
  try {
    const order = await createOrder(req.body.items, req.body.username, res);
    // console.log(order);
    const newOrder = await order.save();
    res.json(newOrder);
    console.log('-------------------Neworder-------------------\n' + newOrder);
    // console.log('ORDER-[%s] %s added', items._id, items.name);
  } catch (err) {
    res.json({
      message: err
    });
  }
});



module.exports = router;