//Check the items  or   create order by itemID

// const Items = require('../models/items');
const Order = require('../models/orders');
// const Payment = require('../models/payment');


const createPayment = async (orderId, user) => {
let payment = require('../routes/paypal/paymentTemp.json');

let orderDetail = {};
  try {
    orderDetail = await Order.findById(orderId);
    // console.log('<------ orderDetail1 ------>\n', orderDetail);
  } catch (err) {
    console.log('<------ err try ------>\n', err);
  }

  // console.log('<------ orderDetail2 ------>\n', orderDetail);
  // const orderDetail = orderId;
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

const savePayid = async (id,payId,link) => {
  console.log('<------ savePayid and Link ------>');
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, {
      $set: {
        payid: payId,
        paylink: link
      }
    });
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

const savePaid = async (payId) => {
  console.log('<------ savePaid status ------>');
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
  createPayment,savePayid,getTransctions,savePaid
};
