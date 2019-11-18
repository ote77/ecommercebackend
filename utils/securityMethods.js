const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv/config');


const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SCRECT, {
    expiresIn: 60 * 60 * 24 * 30  // expires in 30 days
  });
  return token;
};

const bcryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const bPassword = await bcrypt.hash(password, salt);
  return bPassword;
};

const comparePassword = async (bodyPassword,dataPassword) => {
  const validPassword = await bcrypt.compare(
  bodyPassword,
  dataPassword
  );
  return validPassword;
};
module.exports = {
  generateToken, bcryptPassword, comparePassword
};
