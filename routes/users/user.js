const express = require('express');
const router = express.Router();
const User = require('../../models/users');
const auth = require('../../middleware/auth');
const {
  getUserByUsername,
  newAddress,
  getOrderListByuserName,
  checkUsernameEmail
} = require('../../utils/userMethods');
const {
  itemList
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

      console.log('<------ payload ------>', payload);
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
        username: user.username
      };
      console.log('<------ payload ------>', payload);
      const token = generateToken(payload);
      res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .json({
          success: true,
          username: user_data.username,
          email: user_data.email,
          firstName: user_data.firstName,
          lastName: user_data.lastName
        });
      console.log('<------ new user added ------>\n', newUser.username);
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
    user.wishlist = req.body;
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
    const items = await itemList(user.wishlist);
    res.status(200).json({
      success: true,
      wishlist: items
    });
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
    res.json({
      message: err
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
