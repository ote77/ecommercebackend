
//Check the items  or   create order by itemID

const Items = require('../models/items');
// const Order = require('../models/orders');
const {
  nextId
} = require('../jss/addid');

// get item list/single item  the output differs according to user_type
const getItemList = async (filter,user_type) => {
  console.log('<------ %s getItemList: ------>',user_type);
  let items = [];
  if (user_type=="admin") {
   items = await Items.find(filter,'-__v');
  } else {
   items = await Items.find(filter,'-__v -status');
  }
  return items;
};

// New item:
const addNewItem = async (item) => {
  const id = await nextId();
  const items = new Items({
    _id: id,
    ...item
  });
  const newItem = await items.save();
  return newItem;
};

const patchItem = async (id,item) => {
  console.log('<------ patchItem ID: %s ------>',id);
  const modifiedItem = await Items.findByIdAndUpdate(id, {
    $set: {
      ...item
    }
  });
  return modifiedItem;
};

//Used to get map item list in cart and wishlist.
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
    if (stockItems && stockItems.status=="Sale") {
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
  itemList,getItemList,addNewItem,patchItem
};
