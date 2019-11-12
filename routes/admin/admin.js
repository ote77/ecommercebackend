const express = require('express');
const router = express.Router();
const Admin = require('../../models/admin');
const jwt = require('jsonwebtoken');
const adminauth = require('../../middleware/adminauth');
require('dotenv/config');

const {
  getItemList,addNewItem,patchItem
} = require('../../somemethodstemp/itemMethods');

const {
  getBriefOrderforAdmin,getOrderById
} = require('../../somemethodstemp/orderMethods');
const {
  getUserByUsername
} = require('../../somemethodstemp/userMethods');

router.use(async (req, res, next) => {
  if (req.url != '/login' && req.url != '/register') {
    console.log('[ adminauth in] ', req.url );
    adminauth(req, res, next);
  } else {
    next();
  }
});

router.get('/login', async (req, res) => {
  try {
    const user_data = await Admin.findOne({
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

router.post('/register', async (req, res) => {
  //check user exist
    const user = new Admin({
      ...req.body
    });
    try {
      user.displayname=user.username;
      const newUser = await user.save();
      console.log(newUser);
      res.status(201).json({
        status: 201,
        message: "New admin created successfully"
      });
      console.log('<------ new %s added ------>\n%s',newUser.user_type, newUser.username);
      // console.log('ITEM-[%s] %s added', newUser._id, newUser.username);
    } catch (err) {
      console.log('<------ err ------>\n', err);
      res.status(500).json({
        success: false,
        message: err
      });
    }
});

//Products management
//get item list
router.get('/items', async (req, res) => {
  try {
    const items = await getItemList({},req.user.user_type);
    res.status(200).json({
      success: true,
      items
    });
  } catch (err) {
    console.log('<------ err in get items ------>\n', err);
    res.status(404).json({
      success: false,
      message: 'Cannot get item list'
});
  }
});

//Add new products
router.post('/items', async (req, res) => {
  try {
    const newItem = await addNewItem(req.body);
    res.status(201).json({
      success: true,
      message: 'New item added'
    });
    console.log('ITEM-[%s] %s added', newItem._id, newItem.name);
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.status(400).json({
      success: false,
      message: err
    });
  }
});

//get one item
router.get('/items/:itemId', async (req, res) => {
  try {
    console.log('<------ 1 ------>');
    const items = await getItemList({_id:req.params.itemId},req.user.user_type);
    res.status(200).json({
      success: true,
      items
    });
  } catch (err) {
    console.log('<------ err in get items ------>\n', err);
    res.status(404).json({
      success: false,
      message: 'Cannot get item list'
});
  }
});

//modify item
router.patch('/items/:itemId', async (req, res) => {
  try {
    const modifiedItem = await patchItem(req.params.itemId,req.body);
    res.status(200).json({
      success: true,
      message: 'Item updated'
    });
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.status(400).json({
      success: false,
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
    console.log(order);
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
