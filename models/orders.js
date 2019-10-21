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
  }
});

module.exports = mongoose.model('Order', orderSchema);