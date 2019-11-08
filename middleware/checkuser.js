const jwt = require('jsonwebtoken');


//check if the user is login or not and return cart items
const loginOrNot = (req, res, next) => {
  const token = req.headers['x-access-token'];
  // console.log('<------ req ------>\n', req.user);
  if (token) {
    jwt.verify(token, process.env.JWT_SCRECT, (err, decoded) => {
      // console.log('<------ decoded ------>\n', decoded);
      if (err) {
        return res.json({
          status: 403,
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        req.user = decoded;
        console.log('<------ req.user: ------>\n', req.user.username);
        next();
      }
    });
  } else {
    return res.json({
      status: 403,
      success: false,
      message: 'No token.'
    });
  }
};

module.exports = auth;
