const express = require('express');
const router = express.Router();
// const Items = require('../../models/items');
// const Order = require('../../models/orders');
require('dotenv/config');
// const {
//   createPayment
// } = require('../../jss/createPayment');
const {
  savePayid,createPayment,getTransctions,savePaid
} = require('../../jss/paymentMethods');

const paypal = require('paypal-rest-sdk');
paypal.configure({
  mode: 'sandbox',
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SERECT
});

//Paypal config
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


router.post('/payment', (req, res) => {
  console.log("backend pay");
  var create_payment_json = require('./payment.json');

  console.log("2");
  paypal.payment.create(create_payment_json, function(error, payment) {
    if (error) {
      throw error;
    } else {
      console.log(payment);
      for (let link of payment.links) {
        if (link.rel === 'approval_url') {
          console.log(typeof link.href);
          res.redirect(link.href);
          console.log("redirected");
        }
      }
    }
  });
});

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
          savePayid(req.params.orderId,payment.id,link.href);
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
  console.log(JSON.stringify(execute_payment_json));
  paypal.payment.execute(req.query.paymentId, execute_payment_json, function(error, payment) {
    if (error) {
      console.log('<------ err/process ------>\n', error);
    } else {
      if (payment.state == 'approved') {
        savePaid(req.query.paymentId);
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
