const Order = require('../models/orders');

const savePayid = async (id,payId) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, {
      $set: {
        payid: payId
      }
    });
    console.log('<------ updatedOrder ------>\n', updatedOrder);
    return updatedOrder;
  } catch (err) {
    console.log('<------ err in savePayid ------>\n', err);
  }
};

module.exports = {
  savePayid
};
