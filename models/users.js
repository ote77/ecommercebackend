const mongoose = require('mongoose');

//Define how your data looks like

const usersSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: 'Please provide the username'
  },
  displayname: {
    type: String,
    required: 'Please set a display name'
  },
  user_type: {
    type: String,
    enum: ['client', 'admin', 'staff'],
    default: "client"
  },
  password: {
    type: String,
    required: 'Please provide the password'
  },
  confirm_password: {
    type: String,
    required: "Please provide the confirm password."
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required'
  },
  address: [{
      line1: String,
      city: String,
      country_code: String,
      postal_code: String,
      state: String,
      default: Boolean

  }],
  cart: Array,
  wishlist: Array,
  orders: [{type: String}]

});
function passwordConfirm(value) {
  // `this` is the mongoose document
  return this.password == value;
}

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

module.exports = mongoose.model('Users', usersSchema);
