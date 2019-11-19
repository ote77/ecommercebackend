
let tempName;
let title;

const a = (type) => {
  switch(type) {
       case 'welcome':
          tempName = 'welcome.ejs';
          title = 'Welcome to Flawless';
          break;
       case 'order':
          tempName = 'order.ejs';
          title = 'Your Order Confirmation';
          break;
       default:
          temp='123';
  }
};

a('order');
console.log('<------ tempName ------>\n', tempName);
console.log('<------ title ------>\n', title);
