const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
require('dotenv/config');

const {
  savePayid,
  createPayment,
  getTransctions,
  recordSuccessPayment,
  createPayment2
} = require('../../jss/paymentMethods');
const {
  saveOrderToUser
} = require('../../somemethodstemp/userMethods');
const {
  getOrderById
} = require('../../somemethodstemp/orderMethods');
//Paypal config

const paypal = require('paypal-rest-sdk');
paypal.configure({
  mode: 'sandbox',
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SERECT
});


router.get('/payments/:payId', (req, res) => {
  var paymentId = req.params.payId;
  paypal.payment.get(paymentId, function(error, payment) {
    if (error) {
      console.log(error);
    } else {
      res.json(payment);
    }
  });
});

//combine stage one with stage two
router.post('/payment', auth, async (req, res) => {
  console.log('<------ Creating payment by %s ------>', req.user.username);
  var order;
  try {
    order = await createPayment2(req.body.items, req.body.user, req.user.username);
    // console.log('<------ return order ------>\n', order);
    saveOrderToUser(req.body.user.username, order.orderId);

    //PayPal process
    paypal.payment.create(order.payment, function(error, payment) {
      if (error) {
        console.log('<------ paypal.payment.create ------>\n', error);
      } else {
        console.log('<------ payid, orderID ------>');
        console.log(payment.id, order.orderId);
        for (let link of payment.links) {
          if (link.rel === 'approval_url') {
            console.log('redirect link: ', link.href);
            //save payid to the order detail
            savePayid(order.orderId, payment.id);
            res.redirect(link.href);
            console.log('<------ redirected ------>');
          }
        }
      }
    });
  } catch (e) {
    console.log('<------ e ------>\n', e);
    res.status(400).json({
      success: false,
      message: e
    });
  }


});

router.get('/orders/checkout/:id', async (req, res) => {
  //find order and return if the order belongs to this user
  try {
    const order = await getOrderById(req.params.id);
    if (order.username == req.user.username) {
      res.status(200).json({
        success: true,
        order
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Order could not be found"
    });
  }
});
//repay the order.
router.post('/payment/:orderId', async (req, res) => {
  try {
    orderDetail = await getOrderById(req.params.orderId);
    // console.log(payment);
  } catch (err) {
    console.log('<------ err test------>\n', err);
    res.json({
      message: err
    });
  }
  paypal.payment.get(orderDetail.payid, function(error, payment) {
    if (error) {
      console.log(error);
    } else {
      for (let link of payment.links) {
        if (link.rel === 'approval_url') {
          console.log('<Redirect link>: \n', link.href);
          res.redirect(link.href);
          console.log('<------ redirected ------>');

        }
      }
    }
  });
});

router.get('/process', async (req, res) => {
  console.log("catched /process");
  let transactions = {};
  try {
    // console.log('<------ req.query.paymentId ------>\n', req.query.paymentId);
    transactions = await getTransctions(req.query.paymentId);
    // console.log('<------ transctions ------>\n', transctions);
  } catch (e) {
    console.log('<------ error in process ------>\n', e);
  }
  // console.log('<------ transactions ------>\n', transactions);
  // var detail = require('./payment.json');
  var execute_payment_json = {
    "payer_id": req.query.PayerID,
    "transactions": [transactions]
  };
  // console.log(JSON.stringify(execute_payment_json));
  paypal.payment.execute(req.query.paymentId, execute_payment_json, function(error, payment) {
    if (error) {
      console.log('<------ err/process ------>\n', error);
    } else {
      if (payment.state == 'approved') {
        recordSuccessPayment(req.query.paymentId, payment.transactions[0].related_resources[0].sale.id);
        res.redirect('/approved');
        console.log('payment completed successfully');
      } else {
        res.redirect('/?denied');
        console.warn('payment not successful');
      }
    }
  });
});

router.get('/approved', (req, res) => {
  res.json({
    message: "success!"
  });
});
module.exports = router;
