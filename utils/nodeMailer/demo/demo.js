// "use strict";
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: 'Hotmail', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 587, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: 'oty1994@hotmail.com',
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: 'H8023.318l',
  }
});

let mailOptions = {
  from: '"Ote" <oty1994@hotmail.com>', // sender address
  to: 'shsharma93@gmail.com', // list of receivers
  subject: 'Hello?', // Subject line
  // 发送text或者html格式
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
