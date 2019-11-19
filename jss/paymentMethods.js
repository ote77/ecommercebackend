const Order = require('../models/orders');
// const User = require('../models/user');
const {
  createOrder
} = require('./createOrder');
const {
  saveOrderToUser
} = require('../utils/userMethods');
const {mailService} = require('../utils/nodeMailer/welcome/transporter');

//user: username,shipping_address
// first-order-or-not
const createPayment = async (items, user, username) => {
let payment = require('../routes/paypal/paymentTemp.json');

let orderDetail = {};
  try {
    orderDetail = await createOrder(items,username);
  } catch (err) {
    throw err;
  }
  let paymentItems = [];
  let subtotal = 0;
  for (var i in orderDetail.items) {
    paymentItems[i] = {
      "name": orderDetail.items[i].name,
      "description": "change to items.description after database",
      "quantity": orderDetail.items[i].quantity,
      "price": orderDetail.items[i].price,
      "sku": orderDetail.items[i]._id,
      "currency": "AUD"
    };
    subtotal += orderDetail.items[i].quantity * orderDetail.items[i].price;
    // console.log('<------ payment.transactions[0].amount.details.subtotal ------>\n', payment.transactions[0].amount.details.subtotal);
  }

  subtotal = subtotal.toFixed(2);
  payment.transactions[0]={
    "amount": {
      "total": subtotal,
      "currency": "AUD",
      "details": {
        "subtotal": subtotal,
        "shipping": 9.95,
        "shipping_discount": 9.95
      }
    },
    "description": "Flawless.",
    "invoice_number": orderDetail._id,
    "item_list": {
      "items": paymentItems,
      "shipping_address": user.address
    },
    "payment_options": {
      "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
    }
  };
  payment.payer.payer_info.email = user.email;
  // payment.transactions[0].item_list.items = paymentItems;
  // // console.log('<------ item_list.items ------>\n', payment.transactions[0].item_list.items);
  // payment.transactions[0].invoice_number = orderDetail._id;
  // payment.transactions[0].item_list.shipping_address = user.address;
  // payment.transactions[0].amount.total = payment.transactions[0].amount.details.subtotal;


  orderDetail.transactions=payment.transactions[0];
  orderDetail.amount=payment.transactions[0].amount;
  orderDetail.address=user.address;
  orderDetail.status= "Created";
  orderDetail.save();
  // console.log('<------ orderDetail After create payment ------>\n', orderDetail);
  const result = {orderId:orderDetail._id,payment};
  // console.log('<------ orderId ------>:', orderDetail._id);
  return result;
};


const savePayid = async (id,payId) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, {
      $set: {
        payid: payId
      }
    });
    console.log('<------ savePayid ------>');
    return updatedOrder;
  } catch (err) {
    console.log('<------ err in savePayid ------>\n', err);
  }
};

//get transctions file for the execute process
const getTransctions = async (payId) => {
  try {
    const payment = await Order.findOne({payid:payId});
    // console.log('<------ getTransctions ------>\n', payment.transactions);
    // console.log('<------ payment ------>\n', payment);
    return payment.transactions;
  } catch (err) {
    console.log('<------ err in getTransctions ------>\n', err);
  }
};

//Record the order after success payment by paid and transction ID
const recordSuccessPayment = async (payId,transactionId) => {
  console.log('<------ recordSuccessPayment status ------>:');
  try {
    const updatedOrder = await Order.findOneAndUpdate({payid:payId}, {
      $set: {
        paid: true,
        transactionID: transactionId
      }
    });
    let message ={
      title:updatedOrder.address.recipient_name,
      orderNumber:updatedOrder._id,
    };
    //send confirmation email.
    mailService(message,updatedOrder.username,'order');
    console.log('<------ transactionId ------>\n', transactionId);
    return updatedOrder;
  } catch (err) {
    console.log('<------ err in savePayid ------>\n', err);
  }
};


//backup.....
const createPayment3 = async (orderId, user) => {
let payment = require('../routes/paypal/paymentTemp.json');

let orderDetail = {};
  try {
    orderDetail = await Order.findById(orderId);
  } catch (err) {
    console.log('<------ orderdetail ------>\n', err);
  }

  const userDetail = user;
  let paymentItems = [];
  payment.transactions[0].amount.details.subtotal = 0;
  for (var i in orderDetail.items) {
    paymentItems[i] = {
      "name": orderDetail.items[i].name,
      "description": "description here",
      "quantity": orderDetail.items[i].quantity,
      "price": orderDetail.items[i].price,
      "sku": orderDetail.items[i]._id,
      "currency": "AUD"
    };
    payment.transactions[0].amount.details.subtotal += orderDetail.items[i].quantity * orderDetail.items[i].price;
    // console.log('<------ payment.transactions[0].amount.details.subtotal ------>\n', payment.transactions[0].amount.details.subtotal);
  }


  payment.transactions[0].item_list.items = paymentItems;
  // console.log('<------ item_list.items ------>\n', payment.transactions[0].item_list.items);
  payment.transactions[0].invoice_number = orderDetail._id;
  payment.transactions[0].item_list.shipping_address = user.address;
  payment.payer.payer_info.email = user.email;
  payment.transactions[0].amount.total = payment.transactions[0].amount.details.subtotal + payment.transactions[0].amount.details.shipping - payment.transactions[0].amount.details.shipping_discount;
  console.log('<------ total: ', payment.transactions[0].amount.total);


  orderDetail.transactions=payment.transactions[0];
  orderDetail.save();
  // console.log('<------ orderDetail After create payment ------>\n', orderDetail);

  return payment;
};
module.exports = {
  createPayment,savePayid,getTransctions,recordSuccessPayment
};
