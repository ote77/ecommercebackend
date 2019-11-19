const {mail} = require('./transporter');

const message = {
  title: 'Ote',
  coupon: '123',
};

console.log('<------ title ------>\n', mail(message));
