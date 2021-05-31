const express = require('express');
const path = require('path');
const { validationResult} = require('express-validator');
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
let { Employee } = require('./models/employees');


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

app.use(function validateRequestSchema(req,res,next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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
  Employee.find({}, function (err, employees) {
    if (err) {
      console.log(err);
    } else {
      
      //template response
      const {page} = req.query.page || 1;
      const options = {
        page: 1,
        limit: 5,
      };
      const pagEmployees = Employee.paginate({}, options).then((results, err) => {
        if(!err){
          console.log(results)
          res.render('index', {
            employees: employees,
            testObj: results.docs, 
            page_count: results.totalPages
          });
          
          
        } 

        // json response
        
        /*const page = req.query.page;
        const limit = 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = employees.slice(startIndex, endIndex)
        res.json(result);*/
      }) 
    } 
  });
    
});

app.post('/', async (req, res) => {
  try {
    field = req.body.field
    value = req.body.value
    switch (field) {
      case 'surname':
        query = {surname: value};
        break;
      case 'second_surname':
        query = {second_surname: value};
        break;
      case 'firstname':
        query = {firstname: value};
        break;
      case 'midlename':
        query = {midlename: value};
        break;
      case 'id_type':
        query = {id_type: value};
        break;
      case 'id_number':
        query = {id_number: value};
        break;
      case 'country':
        query = {country: value};
        break;
      case 'email':
        query = {email: value};
        break;
    }
    console.log(query)
    const employees = await Employee.find(query);
    if (!employee) {
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }
    res.render('index', {
      employees: employees
    });

  } catch (e) {
    res.send(e);
  }
});

// Route Files
let employees = require('./routes/employees');
let users = require('./routes/users');
app.use('/employees', employees);
app.use('/users', users);

// Start Server
app.listen(3000, function () {
  console.log('Server started on port 3000...');
});