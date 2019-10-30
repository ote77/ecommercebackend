const Order = require('../models/orders');

const getOrder = async (id) => {
console.log('<------ 1 ------>');
  try {
    const order = await Order.findById(id);
    console.log('<------ order ------>\n', order);
    return order;
  } catch (err) {
    console.log('<------ err ------>\n', err);
  }
};

getOrder("5db788409668876b041a1347");
