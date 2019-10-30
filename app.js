const express = require('express');
const app = express();
const mongoose = require('mongoose');
//Send body using Json
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());


require('dotenv/config');

//Import route
// const itemsRoute = require('./routes/items');
//middleware
app.use(async (req, res, next) => {
  // console.log(res);
  const start = Date.now();
  // await console.log(res.locals);
  await next();
  const ms = Date.now() - start;
  console.log('[%s] %s - (%sms)', req.method, req.url, ms);
  // console.log(res.locals);
});

app.use('/items', require('./routes/items'));
app.use('/item', require('./routes/item'));
app.use('/order', require('./routes/order'));
app.use('/orders', require('./routes/orders'));
app.use('/tests', require('./routes/tests'));
app.use('/checkout', require('./routes/paypal/checkout'));

// app.use('/posts',() => {
//   console.log('This is a middleware');
// });


//routes



app.get('/', (req, res) => {
  res.send('weare');
});




//connect to db
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => console.log('Database connected\n Enjoy debugging\n       :)')
);

app.listen(3000);
