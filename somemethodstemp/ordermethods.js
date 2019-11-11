const Order = require('../models/orders');



const getOrderById = async (id) => {
  console.log('<------ getOrderById ------>\n', id);
  const order = await Order.findById(id);
    return order;
};

const getBriefOrder = async (orderId) => {
  console.log('<------ getBriefOrder ------>\n', orderId);
  var opt={
    date:1,
    items:1,
    paid:1
  };
  const briefOrder = await Order.findById(orderId, opt);
    return briefOrder;
};

const getDetailOrder = async (orderId) => {
  console.log('<------ getBriefOrder ------>\n', orderId);

};



module.exports = {
  getOrderById,getBriefOrder
};
