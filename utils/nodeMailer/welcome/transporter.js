// "use strict";
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs  = require('fs');
const path = require('path');
require('dotenv/config');

let transporter = nodemailer.createTransport({
  name: 'flawlesstrading',
  host: 'mail.flawlesstrading.com.au',
  port: 465,
  secureConnection: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
  rejectUnauthorized: false
  }
});

//send email to user.
const mailService = (data,email,type) => {

  let tempName;
  let title;
switch(type) {
     case 'welcome':
     console.log('<------ welcome ------>');
        tempName = 'welcomecoupon.ejs';
        title = 'Welcome to Flawless';
        break;
     case 'order':
     console.log('<------ order ------>');
        tempName = 'orderexample.ejs';
        title = 'Your Order Confirmation';
        break;
     default:
        temp='123';
}
// console.log('<------ data ------>\n', data);
// console.log('<------ email ------>\n', email);
const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, tempName), 'utf8'));
const html = template(data);

let mailOptions = {
  from: '"Flawless Team" <info@flawlesstrading.com.au>', // sender address
  to: email, // list of receivers
  subject: title, // Subject line
  // text: 'Hello world?', // plain text body
  html: html // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  let envelope = JSON.stringify(info.envelope);
  console.log('Message sent %s messageId: %s', envelope, info.messageId);
  // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
});
};

//send email to Admin.

const sendToAdmin = (data,type) => {
  let tempName;
  let title;
switch(type) {
     case 'contactus':
     console.log('<------ contactus Email ------>');
        tempName = 'contactus.ejs';
        title = 'Email from customer';
        break;
     case 'Neworder':
     console.log('<------ order ------>');
        tempName = 'order.ejs';
        title = 'New order received';
        break;
     default:
        temp='123';
}
// console.log('<------ data ------>\n', data);
// console.log('<------ email ------>\n', email);
const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, tempName), 'utf8'));
const html = template(data);

let mailOptions = {
  from: '"Flawless" <info@flawlesstrading.com.au>', // sender address
  to: 'ooottee@gmail.com', // To admin.
  subject: title, // Subject line
  // text: 'Hello world?', // plain text body
  html: html // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  let envelope = JSON.stringify(info.envelope);
  console.log('Message sent %s messageId: %s', envelope, info.messageId);
  // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
});
};

module.exports = {
  mailService, sendToAdmin
};
