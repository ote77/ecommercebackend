const express = require('express');
const router = express.Router();
const User = require('../../models/users');
const auth = require('../../middleware/auth');
const {mailService} = require('../../utils/nodeMailer/welcome/transporter');
const {
  getUserByUsername,
  newAddress,
  getOrderListByuserName,
  checkUsernameEmail,
  addItemToWishlist
} = require('../../utils/userMethods');
const {
  itemList,getWishList
} = require('../../utils/itemMethods');
const {
  getOrderById
} = require('../../utils/orderMethods');
const {
  generateToken,
  bcryptPassword,
  comparePassword
} = require('../../utils/securityMethods');



//Use auth in user url excpet login and register
router.use(async (req, res, next) => {
  if (req.url != '/login' && req.url != '/register') {
    console.log('<------ auth in ------>', req.url);
    auth(req, res, next);
  } else {
    next();
  }
});


//User manage  ------>
//login:
router.post('/login', async (req, res) => {
  try {
    const user_data = await User.findOne({
      "username": req.body.username
    });
    if (!user_data) {
      return res.status(400).json({
        success: false,
        message: "Invalid username or password.",
      });
    }
    const validPassword = await comparePassword(req.body.password, user_data.password);
    if (validPassword) {
      const payload = {
        username: user_data.username,
        firstName: user_data.firstName
      };

      // console.log('<------ payload ------>', payload);
      const token = generateToken(payload);
      console.log('<------ token ------>\n', token);
      res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .json({
          success: true,
          user: {
            username: user_data.username,
            email: user_data.email,
            firstName: user_data.firstName,
            lastName: user_data.lastName
          }
        });
    } else {
      res.status(403).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.status(400).json({
      success: false,
      message: err
    });
  }

});

//Register
router.post('/register', async (req, res) => {
  //check user exist
  const exist = await checkUsernameEmail(req.body.username, req.body.email);
  if (exist) {
    console.log('<------ existUser ------>');
    res.status(400).json({
      success: false,
      message: 'Username/ email already existed',
      exist: exist
    });
  } else {
    const user = new User({
      ...req.body
    });
    const {
      password
    } = req.body;
    const bPassword = await bcryptPassword(password);
    user.password = bPassword;
    user.confirm_password = 'You can\'t see';
    user.displayname = user.firstName;
    try {
      const newUser = await user.save();
      const payload = {
        username: user.username,
        firstName: user.firstName
      };
      // Email information
      const message = {
        title: user.firstName,
        coupon: '10',
      };

      //nodeMailer
      mailService(message,user.email,'welcome');

      console.log('<------ payload ------>', payload);
      const token = generateToken(payload);
      res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .json({
          success: true,
          user: {
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
          });
      console.log('<------ new user added ------>\n', newUser.username);
      console.log('<------ token ------>\n', token);
    } catch (err) {
      console.log('<------ err ------>\n', err);
      res.status(500).json({
        success: false,
        message: err
      });
    }

  }

});

router.get('/info', async (req, res) => {
  try {
    // console.log('<------ req.body ------>\n', req.body);
    const user = await User.findOne({"username":req.user.username}, "username email firstName lastName birthday orders");
    res.status(200).json({
      success: true,
      info: user
    });
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.status(400).json({
      success: false,
      message: err
    });
  }
});
//wishlist   ----->
//add wishlist to user db
router.post('/wishlist', async (req, res) => {
  try {
    const user = await getUserByUsername(req.user.username);
    // console.log('<------ req.body ------>\n', req.body);
    user.wishlist = req.body;
    const items = await itemList(user.wishlist);
    user.save();
    res.status(200).json({
      success: true,
      cart: items
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err
    });
  }
});

router.post('/wishlist/:itemId', async (req, res) => {
  try {
    const user = await addItemToWishlist(req.user.username,req.params.itemId);
    console.log('<------ Add item[%s] to wishlist ------>', req.params.itemId);
    res.status(200).json({
      success: true,
      message: 'Successfully add to wishlist'
    });
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.status(400).json({
      success: false,
      message: err
    });
  }
});

//get wishlist from user db
router.get('/wishlist', async (req, res) => {
  try {
    // console.log('<------ req.body ------>\n', req.body);
    const user = await getUserByUsername(req.user.username);
    const items = await itemList(user.wishlist);
    res.status(200).json({
      success: true,
      wishlist: items
    });
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.status(400).json({
      success: false,
      message: err
    });
  }
});

//address function
router.get('/address', async (req, res) => {
  try {
    // console.log('<------ req.body ------>\n', req.body);
    const user = await getUserByUsername(req.user.username);
    res.json(user.address);
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.json({
      message: err
    });
  }
});

router.post('/address', async (req, res) => {
  try {
    // console.log('<------ req.body ------>\n', req.body);
    const user = await newAddress(req.user.username, req.body);
    res.json(user);
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.json({
      message: err
    });
  }
});

//get brief order list
router.get('/orders', async (req, res) => {
  try {
    const orderList = await getOrderListByuserName(req.user.username);
    res.status(200).json({
      success: true,
      orderList
    });
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.status(404).json({
      success: false,
      message: "Order could not be found"
    });
  }
});


router.get('/orders/:id', async (req, res) => {
  //find order and return if the order belongs to this user
  try {
    const order = await getOrderById(req.params.id);
    if (order.username == req.user.username) {
      res.status(200).json({
        success: true,
        order
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Order could not be found"
    });
  }
});




module.exports = router;
