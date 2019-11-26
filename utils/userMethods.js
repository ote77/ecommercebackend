const User = require('../models/users');

const {
  getBriefOrder
} = require('./orderMethods');
const {
  itemList
} = require('./itemMethods');

const getUserByUsername = async (username) => {
    const user = await User.findOne({"username":username});
    return user;
};

const checkFirstOrder = async (username) => {
    const user = await User.findOne({"username":username}, "firstOrder");
    return user.firstOrder;
};

const setUsedFirstOrder = async (username) => {
    const firstOrder = await User.findOneAndUpdate({"username":username}, {
      $set: {
        firstOrder: false
      }
    });
    return firstOrder;
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

const saveOrderToUser = async (username,orderId) => {
  try {
    const userWithOrderId = await User.findOneAndUpdate({username:username}, {
      $push: {
        orders: {
          $each:[orderId],
          $position: 0
        }
      },
      $set: {
        cart:[]
      }
    });
    // console.log('<------ userWithOrderId ------>\n', userWithOrderId.username);
    // console.log('<------ userWithOrderId ------>\n', userWithOrderId);
  } catch (e) {
    console.log('<------ e in saveOrderToUser ------>\n', e);
  }
};

const getOrderListByuserName = async (username) => {
  console.log('<------ getOrdersByuserName ------>\n', username);
  const user = await getUserByUsername(username);
  let orderList=[];
  for (var i in user.orders) {
    let briefOrder = await getBriefOrder (user.orders[i]);
    orderList.push(briefOrder);
  }
  return orderList;
};

const addItemToWishlist = async (username,itemId) => {
  try {
    const item = await User.findOneAndUpdate({username:username}, {
      $addToSet: {
        wishlist:
          {_id:itemId}
      }
      // $addToSet: {wishlist: {_id:itemId}}
    });
  } catch (e) {
    console.log('<------ e in saveOrderToUser ------>\n', e);
  }
};

const checkUsernameEmail = async (username,email) => {
  let exist;
  const existUsername = await User.findOne({username:username});
  const existEmail = await User.findOne({email:email});
  if (existUsername!=null) {
    exist = "username";
  } else if (existEmail!=null) {
    exist = "Email";
  }
  console.log('<------ exist ------>\n', exist);
  return exist;
};

const getCartListByuserName = async (username) => {
  const user = await getUserByUsername(username);
  let orderList=[];
  for (var i in user.orders) {
    let briefOrder = await getBriefOrder (user.orders[i]);
    orderList.push(briefOrder);
  }
  return orderList;
};

module.exports = {
  getUserByUsername, newAddress, saveOrderToUser, setUsedFirstOrder,
  getOrderListByuserName, checkUsernameEmail,
  checkFirstOrder, addItemToWishlist
};
