// "use strict";
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'Hotmail',
  port: 587,
  secureConnection: true,
  auth: {
    user: 'oty1994@hotmail.com',
    pass: 'H8023.318l',
  }
});

let mailOptions = {
  from: '"Ote" <oty1994@hotmail.com>', // sender address
  to: 'ooottee@gmail.com', // list of receivers
  subject: 'Hello?', // Subject line
  // text: 'Hello world?', // plain text body
  html: '<b>(sent by nodemailer haha)</b>' // html body
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
