const mongoose = require('mongoose');

//Define how your data looks like

const itemsSchema = mongoose.Schema({
  _id: {
    required: true,
    type: String,
    default: 0
  },
  name: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    default: "Description for this product."
  },
  price: {
    required: true,
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Created', 'Sale', 'Suspended'],
    default: "Sale"
  },
  stock: {
    required: true,
    type: Number,
    default: 0
  },
  image: {
    required: true,
    type: String,
    default: "noimageyet.jpg"
  }

});

module.exports = mongoose.model('Items', itemsSchema);
