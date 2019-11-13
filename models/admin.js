const mongoose = require('mongoose');

//Define how your data looks like

const adminSchema = mongoose.Schema({
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
    enum: ['admin', 'staff'],
    default: "admin"
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
  }
});
function passwordConfirm(value) {
  // `this` is the mongoose document
  return this.password == value;
}

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

module.exports = mongoose.model('Admin', adminSchema);
