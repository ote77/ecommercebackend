const express = require('express');
const router = express.Router();
const Admin = require('../../models/admin');
const adminauth = require('../../middleware/adminauth');

const {
  getItemList,addNewItem,patchItem
} = require('../../utils/itemMethods');
const {
  getBriefOrderforAdmin,getOrderById,changeOrderStatus,removeOrder
} = require('../../utils/orderMethods');
const {
  getUserByUsername
} = require('../../utils/userMethods');
const {
  generateToken, bcryptPassword, comparePassword
} = require('../../utils/securityMethods');

router.use(async (req, res, next) => {
  if (req.url != '/login' && req.url != '/register') {
    // console.log('[ adminauth in] ', req.url );
    adminauth(req, res, next);
  } else {
    next();
  }
});

router.get('/login', async (req, res) => {
  try {
    const user_data = await Admin.findOne({
      "username": req.body.username,
      "user_type":"admin"
    });
    if (!user_data) {
      res.status(401).json({
        status: 401,
        message: "Invalid username.",
      });
    } else {
    const validPassword = await comparePassword(req.body.password,user_data.password);
    if (validPassword) {
      const payload = {
        username: user_data.username,
        user_type: "admin"
      };
      console.log('<------ payload ------>', payload);
      const token = generateToken(payload);
      console.log('<------ token ------>\n', token);
      res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .json({ success: true, username: user_data.username, email:user_data.email,firstName:user_data.firstName,lastName:user_data.lastName });
    } else {
      res.status(403).json({
        success: false,
        message: 'Invalid password'
      });
    }}
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
    const { password } = req.body;
    const bPassword = await bcryptPassword(password);
    user.password = bPassword;
    user.confirm_password = 'You can\'t see';
    user.displayname=user.username;
    try {
      const newUser = await user.save();
      res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .json({ success: true, username: user_data.username, email:user_data.email,firstName:user_data.firstName,lastName:user_data.lastName });
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

    const items = await getItemList(req.body.filter,req.user.user_type);
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
      message: 'Unable to find'
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

//Check User info
router.get('/user/:id', async (req, res) => {
  try {
    // console.log('<------ req.body ------>\n', req.body);
    const user = await getUserByUsername(req.params.id);
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
    const order = await getBriefOrderforAdmin(req.body.filter);
    res.json(order);
    // console.log(order);
  } catch (err) {
    res
      .status(404)
      .json({
        success: false,
        message: 'Order could not be found'
      });
  }
});

router.get('/orders/:orderId', async (req, res) => {
  try {
    const order = await getOrderById(req.params.orderId);
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

router.patch('/orders/:orderId', async (req, res) => {
  try {
    const updatedOrder = await changeOrderStatus(req.params.orderId,req.body.status);
    res.status(200).json({
      success: true,
      message: 'Order updated'
    });
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.status(400).json({
      success: false,
      message: err
    });
  }
});



router.post('/itemlist', async (req, res) => {
  try {
    const itemList = require('../../productlist.json');
    for (var i in itemList.products){
      const newItem = await addNewItem(itemList.products[i]);
      console.log('ITEM-[%s] %s added', newItem._id, newItem.name);
    }
    res.status(201).json({
      success: true,
      message: 'New item list added'
    });
  } catch (err) {
    console.log('<------ err ------>\n', err);
    res.status(400).json({
      success: false,
      message: err
    });
  }
});

router.delete('/orders/', async (req, res) => {
  try {
    const removedOrders = await removeOrder(req.body.filter);
    res.status(200).json({
      success: true,
      message: 'Removed'
    });
  } catch (err) {
    console.log('<------ err in delete orders ------>\n', err);
    res.json({
      message: err
    });
  }
});

module.exports = router;
