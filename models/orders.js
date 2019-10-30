const mongoose = require('mongoose');

//Define how your data looks like

var orderSchema = mongoose.Schema({
  username: String,
  items: Array,
  date: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: false
  },
  transactions: {
    type: Object,
    default: {}
  },
  payid: {
    type: String,
    default: "Unpaid"
  },
  paylink:{
    type: String,
    default: "Wait to set payment"
  },
  payer: Object
});

module.exports = mongoose.model('Order', orderSchema);
