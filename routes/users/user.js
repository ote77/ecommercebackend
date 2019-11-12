const express = require('express');
const router = express.Router();
const User = require('../../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv/config');
const auth = require('../../middleware/auth');
const {
  getUserByUsername, newAddress, getOrderListByuserName
} = require('../../somemethodstemp/userMethods');
const {
  itemList
} = require('../../somemethodstemp/itemMethods');
const {
  getOrderById
} = require('../../somemethodstemp/orderMethods');



//Use auth in user url excpet login and register
router.use(async (req, res, next) => {
  if (req.url != '/login' && req.url != '/register') {
    console.log('<------ auth in ------>', req.url );
    auth(req, res, next);
  } else {
    next();
  }
});


//User manage  ------>
//login:
router.get('/login', async (req, res) => {
  console.log('<------ 1 ------>');
  try {
    const user_data = await User.findOne({
      "username": req.body.username
    });
    if (!user_data) {
      res.status(401).json({
        status: 401,
        message: "Invalid username.",
      });
    }
console.log('<------ 2 ------>');
    const validPassword = await bcrypt.compare(
    req.body.password,
    user_data.password
    );
    console.log('<------ 3 ------>');
    console.log('<------ validPassword ------>\n', validPassword);
    if (validPassword) {
      console.log('user_data here');
      console.log(user_data);
      const payload = {
        username: user_data.username
      };
      console.log('<------ payload ------>', payload);
      const token = jwt.sign(payload, process.env.JWT_SCRECT, {
        expiresIn: 60 * 60 * 6 // expires in 6 hours
      });
      console.log('<------ token ------>\n', token);
      res.status(200).json({
        message: "You have succesfully loggedin.",
        token: token
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Invalid password'
      });
    }
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.status(401).json({
      status: 401,
      message: err
    });
  }

});

//Register
router.post('/register', async (req, res) => {
  //check user exist
  const existUser = await getUserByUsername(req.body.username);
  if (existUser) {
    console.log('<------ existUser ------>');
    res.status(400).json({
      success: false,
      message: 'Username already existed'
    });
  } else {
    const user = new User({
      ...req.body
    });
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    try {
      user.displayname=user.username;
      const newUser = await user.save();
      console.log(newUser);
      res.status(201).json({
        status: 201,
        message: "New user created successfully"
      });
      console.log('<------ new user added ------>\n',newUser.username);
      // console.log('ITEM-[%s] %s added', newUser._id, newUser.username);
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
    const user = await getUserByUsername(req.user.username);
    res.json(user);
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.json({
      message: err
    });
  }
});
//wishlist   ----->
//add wishlist to user db
router.post('/wishlist', async (req, res) => {
  console.log(req.user);
  try {
    const user = await getUserByUsername(req.user.username);
    console.log('<------ req.body ------>\n', req.body);
    user.wishlist=req.body;
    user.save();
    res.json(user.wishlist);
    console.log('<------ user.wishlist ------>\n', user.wishlist);
  } catch (err) {
    res.json({
      message: err
    });
  }
});

//get wishlist from user db
router.get('/wishlist', async (req, res) => {
  try {
    // console.log('<------ req.body ------>\n', req.body);
    const user = await getUserByUsername(req.user.username);
    const items = await itemList(user.wishlist,res);
    res.json(items);
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.json({
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
    const user = await newAddress(req.user.username,req.body);
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
    res.json({
      message: err
    });
  }
});


router.get('/orders/:id', async (req, res) => {
  //find order and return if the order belongs to this user
  try {
    const order = await getOrderById(req.params.id);
    if (order.username==req.user.username) {
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

router.get('/test1', async (req, res) => {
  console.log(req.body);
  try {
    console.log('<------ haha ------>\n');
    res.send('haha');
  } catch (err) {
    res.json({
      message: err
    });
  }
});



//add auth in routes.[test]
router.get('/Check', (req, res) => {
  console.log('<------ use ------>');
  console.log('<------ req.body ------>\n', req.body);
});

// test auth check
router.use('/test', (req, res, next) => {
  const token = req.headers['x-access-token'];
  console.log('<------ x-access-token ------>', token);
  if (token) {
    jwt.verify(token, process.env.JWT_SCRECT, (err, decoded) => {
      console.log('<------ decoded ------>\n', decoded);
      if (err) {
        return res.json({
          status: 403,
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        req.decoded = decoded;
        res.status(200).json({
          message: "You have succesfully loggedin with token."
        });
        // next();
      }
    });
  } else {
    return res.json({
      status: 403,
      success: false,
      message: 'No token.'
    });
  }
});

//append orderID
router.get('/test2', async (req, res) => {
  //need to check if username exists.
  try {
    console.log('<------ haha ------>\n');
    res.send('haha');
    // console.log('ITEM-[%s] %s added', newUser._id, newUser.username);
  } catch (err) {
    res.json({
      message: err
    });
  }
});

module.exports = router;
