
//Check the items  or   create order by itemID

const Items = require('../models/items');
// const Order = require('../models/orders');

// map item detail by ID
const itemList = async (items, res) => {
  console.log(items);
  // Creat order in front or back?
  for (var i in items) {
    let stockItems;
    try {
      // console.log('<------ items[i]._id ------>\n', items[i]._id);
      stockItems = await Items.findById(items[i]._id);
    } catch (e) {
      console.log(e);
    }
    if (stockItems) {
      items[i].price = stockItems.price;
      items[i].name = stockItems.name;
      //quantity max: stock.
      if (items[i].quantity >= stockItems.stock) {
        items[i].quantity = stockItems.stock;
      }
    } else {
      items[i].status="Unavailable";
    }
  }

  return items;
};


module.exports = {
  itemList
};
