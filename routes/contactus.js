const express = require('express');
const router = express.Router();

const {sendToAdmin} = require('../utils/nodeMailer/welcome/transporter');

//Contect us..
router.post('/', async (req, res) => {
  try {
    const message = req.body.message;
    //nodeMailer
    sendToAdmin(message,'contactus');
    res.status(200).json({
      success: true,
      message: 'Email sent'
    });
  } catch (err) {
    res
      .status(404)
      .json({
        success: false,
        message: 'Order could not be found'
      });
      console.log('<------ finish ------>',err);
  }
});

module.exports = router;
