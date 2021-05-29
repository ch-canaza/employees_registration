const express = require('express');
const path = require('path');
const validationResult = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
//const config = require('dotenv').config();
const connectDB = require('./config/database');


const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./models/user');

const bcrypt = require('bcrypt');
//database connection

connectDB();

// Init App
const app = express();

// Bring in Models
//let { Article } = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));




// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Setting session / login 
app.use(cookieParser('secret key'));

// Express Session Middleware
app.use(session({
  secret: 'secret key',
  resave: true,
  saveUninitialized: true
}));

// Passport Config
require('./middleware/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Home Route
app.get('/', function (req, res) {
  res.send('al fin dentro')
  
});

// Route Files
//let articles = require('./routes/articles');
let users = require('./routes/users');
//app.use('/articles', articles);
app.use('/users', users);

// Start Server
app.listen(3000, function () {
  console.log('Server started on port 3000...');
});