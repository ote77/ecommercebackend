const Order = require('../models/orders');
// const User = require('../models/user');
const {
  createOrder
} = require('./createOrder');
const {
  saveOrderToUser
} = require('../somemethodstemp/userMethods');

//create Payment file for Paypal
const createPayment = async (orderId, user) => {
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

//createpayment2 combines create oreder.
//user: username,shipping_address
const createPayment2 = async (items, user) => {
let payment = require('../routes/paypal/paymentTemp.json');

let orderDetail = {};
  try {
    orderDetail = await createOrder(items,user.username);
    // console.log('<------ orderDetail1 ------>\n', orderDetail);
  } catch (err) {
    throw err;
  }
  let paymentItems = [];
  payment.transactions[0].amount.details.subtotal = 0;
  for (var i in orderDetail.items) {
    paymentItems[i] = {
      "name": orderDetail.items[i].name,
      "description": "change to items.description after database",
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
  const result = {orderId:orderDetail._id,payment};
  console.log('<------ result ------>\n', result);
  return result;
};

const savePayid = async (id,payId,link) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, {
      $set: {
        payid: payId,
        paylink: link
      }
    });
    console.log('<------ savePayid and Link ------>');
    return updatedOrder;
  } catch (err) {
    console.log('<------ err in savePayid ------>\n', err);
  }
};



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

const setPaidToTrue = async (payId) => {
  console.log('<------ setPaidToTrue status ------>');
  try {
    const updatedOrder = await Order.findOneAndUpdate({payid:payId}, {
      $set: {
        paid: true,
        paylink: "Paid"
      }
    });
    return updatedOrder;
  } catch (err) {
    console.log('<------ err in savePayid ------>\n', err);
  }
};

module.exports = {
  createPayment,savePayid,getTransctions,setPaidToTrue,createPayment2
};
