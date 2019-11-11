const express = require('express');
const router = express.Router();
const User = require('../../models/users');
const jwt = require('jsonwebtoken');
const adminauth = require('../../middleware/adminauth');
require('dotenv/config');

const {
  getBriefOrderforAdmin,getOrderById
} = require('../../somemethodstemp/orderMethods');
const {
  getUserByUsername
} = require('../../somemethodstemp/userMethods');

router.use(async (req, res, next) => {
  if (req.url != '/login') {
    console.log('<------ adminauth in ------>', req.url );
    adminauth(req, res, next);
  } else {
    next();
  }
});

router.get('/login', async (req, res) => {
  try {
    const user_data = await User.findOne({
      "username": req.body.username,
      "password": req.body.password,
      "user_type":"admin"
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
        username: user_data.username,
        user_type: "admin"
      };
      console.log('<------ payload ------>', payload);
      const token = jwt.sign(payload, process.env.JWT_SCRECT, {
        expiresIn: 60 * 60 * 12 // expires in 12 hours
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

router.get('/user/:id', async (req, res) => {
  console.log('<------ ha ------>');
  try {
    // console.log('<------ req.body ------>\n', req.body);
    const user = await getUserByUsername(req.params.id);
    console.log('<------ user. ------>');
    res.json(user);
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.json({
      message: err
    });
  }
});

//get all orders in brief
router.get('/orders', async (req, res) => {
  try {
    const order = await getBriefOrderforAdmin();
    res.json(order);
    // console.log(items);
  } catch (err) {
    res
      .status(404)
      .json({
        success: false,
        message: 'Order could not be found'
      });
  }
});

router.get('/orders/:id', async (req, res) => {
  //find order and return if the order belongs to this user
  try {
    const order = await getOrderById(req.params.id);
      res.status(200).json({
        success: true,
        order
      });

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




router.get('/Check', (req, res) => {
  console.log('<------ check ------>');
  console.log('<------ req.body ------>\n', req.user);
  res.json(req.user);
});


module.exports = router;
