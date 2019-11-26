//Check the items  or   create order by itemID

const Items = require('../models/items');
const Order = require('../models/orders');


const createOrder = async (items, username, res) => {
  // console.log(items);
  // Creat order in front or back?
  for (var i in items) {
    delete items[i].status;
    let stockItems;
    try {
      stockItems = await Items.findById(items[i].id);
    } catch (e) {
      console.log(e);
    }
    // console.log(stockItems);
    // console.log(items[i]._id);
    // console.log(stockItems._id);
    // console.log(items[i].price);
    // console.log(stockItems.price);
    // console.log(items[i].quantity);
    // console.log(stockItems.stock);

    if (stockItems != null && items[i].price == stockItems.price && items[i].name == stockItems.name) {
      if (items[i].quantity <= stockItems.stock && stockItems.status=="Sale") {
        // console.log('<------ stock ------>\n', stockItems.stock);
        //Can be pushed here to the items with price and name.
        // console.log(items[i]._id + ' available');
      } else {
        console.log('ID-' + items[i]._id + ' No enough stock');
        throw 'ID-' + items[i]._id + ' No enough stock';
      }
    } else {
      console.log('ID-' + items[i]._id + ' detail wrong');
      throw 'ID-' + items[i]._id + ' detail wrong';
    }
  }
  const validatedOrder = new Order({
    username: username,
    items
  });
  // console.log('<------ validatedOrder ------>\n', validatedOrder);
  return validatedOrder;
};


module.exports = {
  createOrder
};
