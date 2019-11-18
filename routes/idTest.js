const express = require('express');
const router = express.Router();
const Items = require('../models/items');
const ItemsNum = require('../models/itemsNum');
const {
  nextId
} = require('../jss/addid');
const {
  createPayment
} = require('../jss/createPayment');
const {
  getTransctions
} = require('../jss/paymentMethods');
const {
  getUserByUsername, newAddress
} = require('../utils/userMethods');
//get back post lists.



router.get('/createidcount', async (req, res) => {
  console.log('<------ 1 ------>');
  try {
    const number = new ItemsNum({
      name: "productid",
      idSum:1
    });
    const id = await number.save();
    res.json(id);
  } catch (err) {
    console.log(err);
    res.json({
      message: err
    });
  }
});

router.get('/addid', async (req, res) => {
  try {
    const sequence_value = await ItemsNum.findOneAndUpdate({
      name: "productid"
    }, {
      $set: {
        idNum: 6
      }
    });
    // console.log('sequenceDocument');
    // console.log(sequence_value);
    res.json(sequence_value);
  } catch (err) {
    console.log(err);
    res.json({
      message: err
    });
  }
});

router.post('/newid/:idNum', async (req, res) => {
  console.log('here');
  const newId = new ItemsNum({
    //passing object here
    idSum: req.params.idNum,
    //change to productid here
    name: 'productid'
  });
  try {
    const savedId = await newId.save();
    res.json(savedId);
  } catch (err) {
    res.json({
      message: err
    });
  }
});


module.exports = router;
