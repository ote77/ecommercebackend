const {
  createPayment
} = require('./jss/createPayment');

const order = {
  "items": [{
      "price": 100,
      "_id": 84,
      "name": "700",
      "quantity": 5
    },
    {
      "_id": 85,
      "price": 40,
      "quantity": 1,
      "name": "750"
    }
  ],
  "date": "2019-10-29T00:28:07.129Z",
  "paid": false,
  "transaction": [],
  "_id": "5db788409668876b041a1347",
  "username": "ote",
  "__v": 0
};

const user = {
  "user": "John Ryan",
  "email": "John.ryan@personal.example.com",
  "address": {
    "line1": "111 First Street",
    "city": "Bri",
    "country_code": "AU",
    "postal_code": "4000",
    "state": "QLD"
  }
};

const payment = createPayment(order,user);
console.log('<------ payment ------>\n', payment);
// console.log('<------ payment ------>\n', payment.transactions[0].amount.details.subtotal);
