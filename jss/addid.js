const ItemsNum = require('../models/itemsNum');
const Items = require('../models/items');

const nextId = async () => {
  try {
    const sequence_value = await ItemsNum.findOneAndUpdate({
      name: 'productid'
    }, {
      $inc: {
        idSum: 1
      }
    });
    // console.log('<------ sequence_value.idSum ------>\n', sequence_value.idSum);
    return sequence_value.idSum;
  } catch (err) {
    console.log(err);
  }
};


module.exports = {
  nextId
};
