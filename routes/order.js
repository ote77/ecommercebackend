const express = require('express');
const router = express.Router();
const Items = require('../models/items');
const Order = require('../models/orders');
//get one order , update one order
const {
  getOrderById,getBriefOrder
} = require('../utils/orderMethods');
//get back an order by id.
router.get('/:orderId', async (req, res) => {
  try {
    const order = await getOrderById(req.params.orderId);
    res.json(order);
  } catch (err) {
    // console.log('<------ err ------>\n', err);
    res
      .status(404)
      .json({
        success: false,
        message: 'Order could not be found'
      });
      console.log('<------ finish ------>');
  }
});

router.get('/brief/:orderId', async (req, res) => {
  try {
    const order = await getBriefOrder(req.params.orderId);
    res.json(order);
  } catch (err) {
    // console.log('<------ err ------>\n', err);
    res
      .status(404)
      .json({
        success: false,
        message: 'Order could not be found'
      });
      console.log('<------ finish ------>');
  }
});

//set order to paid:true after paypal
// router.patch('/:orderId', async (req, res) => {
//   try {
//     const modifiedOrder = await Order.findByIdAndUpdate(req.params.orderId, {
//       $set: {
//         paid: true
//       }
//     });
//     // console.log(modifiedOrder);
//     res.json(modifiedOrder);
//   } catch (err) {
//     res.json({
//       message: err
//     });
//   }
// });

module.exports = router;
