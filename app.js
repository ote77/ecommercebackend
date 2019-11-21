const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require ('cors');
//Send body using Json

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());


require('dotenv/config');

app.use(cors());
//Import route
// const itemsRoute = require('./routes/items');
//middleware
app.use(async (req, res, next) => {
  console.log('[%s] %s', req.method, req.url);
  // console.log(res);
  const start = Date.now();
  // await console.log(res.locals);
  await next();
  const ms = Date.now() - start;
  console.log('(Finished %sms)', ms);
  // console.log(res.locals);
});

app.use('/items', require('./routes/items'));
app.use('/order', require('./routes/order'));
app.use('/orders', require('./routes/orders'));
app.use('/id123tests', require('./routes/idTest'));
app.use('/checkout', require('./routes/paypal/checkout'));
app.use('/cart', require('./routes/cart/cart'));
app.use('/user', require('./routes/users/user'));
app.use('/admin', require('./routes/admin/admin'));

// app.use('/posts',() => {
//   console.log('This is a middleware');
// });


//routes







//connect to db
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => console.log('Database connected\n Enjoy debugging\n       :)')
);

// app.listen(4000, '0.0.0.0');
app.listen(4000);
