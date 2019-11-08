const User = require('../models/users');


const getUserByUsername = async (username) => {
    const user = await User.findOne({"username":username});
    return user;
};

const newAddress = async (username,address) => {
  try {
    // console.log('<------ newAddress ------>');
    const user = await getUserByUsername(username);
    // console.log('<------ user.address before ------>\n', user.address);
    // console.log('<------ user.address.length==0 ------>\n', user.address.length==0);
    if (user.address.length==0) {
      // console.log('<------ yes! ------>');
      address.default=true;
    }
    // console.log('<------ address ------>\n', address);
    user.address.push(address);
    // console.log('<------ user.address after ------>\n', user.address);
    user.save();
    return user;
  } catch (e) {
    console.log('<------ e ------>\n', e);
  }
};

module.exports = {
  getUserByUsername, newAddress
};
