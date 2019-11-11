const Order = require('../models/orders');



const getOrderById = async (id) => {
  console.log('<------ getOrderById ------>\n', id);
  const order = await Order.findById(id,'-transactions');
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

const getBriefOrderforAdmin = async () => {
  console.log('<------ getBriefOrderforAdmin ------>');
  var opt={
    date:1,
    items:1,
    username:1,
    status:1,
    paid:1
  };
  const orderList = await Order.find({}, opt).sort('-date');
    return orderList;
};

const getDetailOrder = async (orderId) => {
  console.log('<------ getBriefOrder ------>\n', orderId);

};



module.exports = {
  getOrderById,getBriefOrder,getBriefOrderforAdmin
};
