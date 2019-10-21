const mongoose = require('mongoose');

//Define how your data looks like

const itemsSchema = mongoose.Schema({
  _id: {
    required: true,
    type: Number,
    default: 0
  },
  name: {
    type: String,
    unique: true,
    required: true
  },
  price: {
    required: true,
    type: Number,
    default: 0
  },
  stock: {
    required: true,
    type: Number,
    default: 0
  }

});

module.exports = mongoose.model('Items', itemsSchema);