// "use strict";
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs  = require('fs');
const path = require('path');

let transporter = nodemailer.createTransport({
  service: 'Hotmail',
  port: 587,
  secureConnection: true,
  auth: {
    user: 'oty1994@hotmail.com',
    pass: 'H8023.318l',
  }
});

const mailService = (data,email,type) => {

  let tempName;
  let title;
switch(type) {
     case 'welcome':
     console.log('<------ welcome ------>');
        tempName = 'welcome.ejs';
        title = 'Welcome to Flawless';
        break;
     case 'order':
     console.log('<------ order ------>');
        tempName = 'order.ejs';
        title = 'Your Order Confirmation';
        break;
     default:
        temp='123';
}
console.log('<------ data ------>\n', data);
console.log('<------ email ------>\n', email);
const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, tempName), 'utf8'));
const html = template(data);

let mailOptions = {
  from: '"Ote" <oty1994@hotmail.com>', // sender address
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
module.exports = {
  mailService
};
