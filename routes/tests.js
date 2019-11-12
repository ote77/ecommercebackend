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
} = require('../somemethodstemp/userMethods');
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

router.get('/1', async (req, res) => {
  console.log('tests');
  const result = (data) => idSum();
  console.log(data);
});

router.get('/2', async (req, res) => {
  console.log('tests');
  try {
    const idSum = Items.countDocuments({}, function(err, data) {
      if (err) console.log(err);
      console.log(data);
    });
  } catch (err) {
    console.log('err');
    res.json({
      message: err
    });
  }
});

router.post('/additem', async (req, res) => {
  // let id = ItemsId.find();
  const idSum = Items.countDocuments({}, function(err, data) {
    if (err) console.log(err);
    const nextId = (data + 1);
    console.log('nextid' + nextId);
  });
  const items = new Items({
    //passing object here
    id: nextId,
    ...req.body
  });
  try {
    const newItem = await items.save();
    //save the post to database
    res.json(newItem);
  } catch (err) {
    res.json({
      message: err
    });
  }
});

router.get('/info/:id', async (req, res) => {
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
module.exports = router;
