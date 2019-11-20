
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
  if (items.length==0) {
    throw 'Unable to find';
  } else {
    return items;
  }
}
};

// New item:
const addNewItem = async (item) => {
  const id = await nextId();
  const items = new Items({
    _id: id,
    image: (id+".jpg"),
    stock: 10,
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
const itemList = async (items) => {
  let cartTotal = 0;
  // console.log(items);
  for (var i in items) {
    let stockItems;
    try {
      stockItems = await Items.findById(items[i].id);
    } catch (e) {
      console.log(e);
    }
    if (stockItems && stockItems.status=="Sale") {
      items[i].price = stockItems.price;
      items[i].name = stockItems.name;

      //quantity max: stock.
      if (items[i].quantity >= stockItems.stock) {
        items[i].quantity = stockItems.stock;
        items[i].status="MaxQuantity";
      }

    } else {
      items[i].status="Unavailable";
      items[i].quantity = 0;
      continue;
    }
    items[i].totalPrice=(items[i].quantity*items[i].price);
    cartTotal += items[i].totalPrice;
  }
  cartTotal = cartTotal.toFixed(2);
  const cart = {
    cartTotal,
    items
  };
  return cart;
};


module.exports = {
  itemList,getItemList,addNewItem,patchItem
};
