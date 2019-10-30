const Order = require('../models/orders');

const getOrder = (id) => {
  console.log('<------ id ------>\n', id);
  Order.findById(id, (err, order) => {
    if (err) console.log('<------ err ------>');
    console.log('<------ order ------>\n', order);
    return order;
  });
};

getOrder("5db788409668876b041a1347");
