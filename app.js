const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');


const app = express();

// Handlebars Middleware
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Set Static Folder
app.use(express.static(`${__dirname}/public`));

// Index Route
app.get('/', (req, res) => {
  res.render('index', {
    stripePublishableKey: keys.stripePublishableKey
  });
});

// Charge Route
app.post('/charge', (req, res) => {
  const amount = 2500;
  console.log(req.body);

  return stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
    
  })
  .catch((error) => {
    console.log('Promise errorB');
  })
  .then((customer) => {
    console.log(customer);
    stripe.charges.create({
      amount:2500,
      description: 'Web Development Ebook',
      currency: 'USD',
      customer: '1'
    }
      
    );
    console.log('here');
  })
  .then((charge) => {
    console.log('Promise errorB');
    res.render('success');
  })
  .catch((error) => {
    console.log('Promise error');
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});