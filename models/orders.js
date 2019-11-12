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
  status: {
    type: String,
    enum: ['Created', 'Received', 'Packing','In transit'],
    default: "Created"
  },
  transactionID: String,
  transactions: {
    type: Object,
    default: {}
  },
  address: {
    type: Object,
    default: {}
  },
  amount: {
    type: Object,
    default: {}
  },
  payid: {
    type: String,
    default: "Unpaid"
  },
  payer: Object
});

module.exports = mongoose.model('Order', orderSchema);
