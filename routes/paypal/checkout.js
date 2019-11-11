const express = require('express');
const router = express.Router();
// const Items = require('../../models/items');
// const Order = require('../../models/orders');
require('dotenv/config');

const {
  savePayid,createPayment,getTransctions,recordSuccessPayment,createPayment2
} = require('../../jss/paymentMethods');
const {
  saveOrderToUser
} = require('../../somemethodstemp/userMethods');
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
router.post('/payment', async(req, res) => {
  console.log("payment v2");
  var order;
  try {
    order = await createPayment2(req.body.items,req.body.user);
    // console.log('<------ return order ------>\n', order);
    saveOrderToUser(req.body.user.username,order.orderId);
  } catch (e) {
    res.json({message:e});
  }

  paypal.payment.create(order.payment, function(error, payment) {
    if (error) {
      console.log('<------ paypal.payment.create ------>\n', error);
    } else {
      console.log('<------ payid, orderID ------>');
      console.log(payment.id,order.orderId);
      for (let link of payment.links) {
        if (link.rel === 'approval_url') {
          console.log('redirect link: ',link.href);
          //save payid to the order detail
          savePayid(order.orderId, payment.id);
          res.redirect(link.href);
          console.log("redirected");
        }
      }
    }
  });
});

//repay the order.
router.post('/payment/:orderId', async (req, res) => {
  console.log("backend pay");
  const user = {
    "user": "John Ryan",
    "email": "John.ryan@personal.example.com",
    "address": {
      "line1": "111 First Street",
      "city": "Bri",
      "country_code": "AU",
      "postal_code": "4000",
      "state": "QLD"
    }
  };
  var create_payment_json;
  try {
    create_payment_json = await createPayment(req.params.orderId, user);
    // console.log(payment);
  } catch (err) {
    console.log('<------ err test------>\n', err);
    res.json({
      message: err
    });
  }
  console.log('<------ creating payment ------>');
  paypal.payment.create(create_payment_json, function(error, payment) {
    if (error) {
      throw error;
    } else {
      for (let link of payment.links) {
        if (link.rel === 'approval_url') {
          console.log(link.href);
          savePayid(req.params.orderId,payment.id);
          res.redirect(link.href);
          console.log("redirected");
        }
      }
    }
  });
});

router.get('/process', async(req, res) => {
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
        recordSuccessPayment(req.query.paymentId,payment.transactions[0].related_resources[0].sale.id);
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
