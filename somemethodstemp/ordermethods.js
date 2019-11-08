const Order = require('../models/orders');



const getOrderById = (id) => {
  console.log('<------ getOrderById ------>\n', id);
  Order.findById(id, (err, order) => {
    if (err) console.log('<------ err ------>');
    console.log('<------ order ------>\n', order);
    return order;
  });
};

const getOrdersByuserName = (username) => {

};

const storeOrderIdinUser = (id,username) => {

};

const get = value;

module.exports = {
  getOrderById
};
