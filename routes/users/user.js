const express = require('express');
const router = express.Router();
const User = require('../../models/users');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
require('dotenv/config');
const {
  getUserByUsername, newAddress
} = require('../../somemethodstemp/userMethods');
const {
  itemList
} = require('../../somemethodstemp/itemMethods');



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
router.get('/login', async (req, res) => {
  try {
    const user_data = await User.findOne({
      "username": req.body.username,
      "password": req.body.password
    });
    if (!user_data) {
      res.status(401).json({
        status: 401,
        message: "Invalid username and password.",
      });
    } else {
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
    }
  } catch (err) {
    res.status(401).json({
      status: 401,
      message: err
    });
  }

});

//Register
router.post('/register', async (req, res) => {
  //need to check if username exists.
  const user = new User({
    ...req.body
  });
  try {
    // user.address[0].default=true;
    user.displayname=user.username;
    const newUser = await user.save();
    console.log(newUser);
    res.json(newUser);
    console.log('<------ new user added ------>\n',newUser.username);
    // console.log('ITEM-[%s] %s added', newUser._id, newUser.username);
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.json({
      message: err
    });
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


router.get('/test1', async (req, res) => {
  //need to check if username exists.
  console.log(req.body);
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
