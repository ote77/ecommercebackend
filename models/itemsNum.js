const mongoose = require('mongoose');

const itemsNumSchema = mongoose.Schema({
  idSum: {
    required: true,
    type: Number,
    default: 0
  },
  name: {
    required: true,
    type: String,
    default: 0
  }
});


module.exports = mongoose.model('ItemsNum', itemsNumSchema);