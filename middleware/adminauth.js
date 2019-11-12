const jwt = require('jsonwebtoken');

const adminauth = (req, res, next) => {
  const token = req.headers['x-access-token'];
  // console.log('<------ req ------>\n', req.user);
  if (token) {
    jwt.verify(token, process.env.JWT_SCRECT, (err, decoded) => {
      // console.log('<------ decoded ------>\n', decoded);
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } if (decoded.user_type!="admin" ) {
        return res.status(403).json({
          success: false,
          message: 'Not admin.'
        });
      } else {
        req.user = decoded;
        console.log('<------ %s: %s ------>',req.user.user_type, req.user.username);
        next();
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      message: 'No token.'
    });
  }
};

module.exports = adminauth;
