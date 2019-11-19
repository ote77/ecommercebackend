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
    status:1,
    paid:1
  };
  const briefOrder = await Order.findById(orderId, opt);
    return briefOrder;
};

const getBriefOrderforAdmin = async (filter) => {
  console.log('<------ getBriefOrderforAdmin ------>');
  var opt={
    date:1,
    items:1,
    username:1,
    status:1,
    paid:1
  };
  const orderList = await Order.find(filter, opt).sort('-date');
    return orderList;
};
//change order status if paid:true
const changeOrderStatus = async (id,status) => {
  console.log('<------ change Order %s Status to %s:  ------>',id,status);
  const updatedOrder = await Order.findByIdAndUpdate(id, {
    $set: {
      status:status
    }
  });
  return updatedOrder;
};
const removeOrder = async (filter) => {
  const removedOrder = await Order.deleteMany(filter);
};



module.exports = {
  getOrderById,getBriefOrder,getBriefOrderforAdmin,changeOrderStatus,removeOrder
};
