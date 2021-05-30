const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Employee } = require('../models/employees');
const { User } = require('../models/user');
const { body, validationResult, query} = require('express-validator');


// Add Route
router.get('/add', ensureAuthenticated, async (req, res) => {
  res.render('add_employee', {
    title: 'Add employee'
  });
});

// Add Submit POST Route
router.post('/add', async (req, res) => {
 try {
  
  // Processing Email
  let processedSurename = req.body.surname.toLowerCase().split(' ').join('') 
  const domineCo = 'cidenet.com.co';
  const domineUs = 'cidenet.com.us';
  let id = 1;
  let generatedEmail = '';
  if (req.body.country == 'Colombia') {
    generatedEmail = req.body.firstname.toLowerCase() + '.' + processedSurename + '@' + domineCo; 
    domine = domineCo;
  } else {
    generatedEmail = req.body.firstname.toLowerCase() + '.' + processedSurename + '@' + domineUs 
    domine = domineUs
  }

  let query = await Employee.findOne({ email: generatedEmail }).exec();
  
  while (query && query.email == generatedEmail) {
    console.log('email already exists')
    let surnameWithtID = processedSurename + '.' + id;
    generatedEmail = req.body.firstname.toLowerCase() + '.' + surnameWithtID + '@' + domine
    query = await Employee.findOne({ email: generatedEmail }).exec();
    id += 1;
  }

  // Processing start date
  let currentDate = new Date(Date.now());
  currentDateParsed = Date.parse(currentDate);
  
  let minimumAllowedDate = currentDate.setMonth(currentDate.getMonth() - 1);
  
  let userTypedDate = req.body.start_date.split('/');

  let processedDate = new Date(parseInt(userTypedDate[1]) + '/' + userTypedDate[0] + '/' + userTypedDate[2]);
  processedDateParsed = Date.parse(processedDate)
  
  let startDate = ''
  if (processedDateParsed <= currentDateParsed && processedDateParsed >= minimumAllowedDate) {
    startDate = processedDate
  } else {
    res.send('invalid date format, should be: DD/MM/YYYY')
  }

  // Processing Register date
  let registerDate = new Date(Date.now());
  
  console.log('start saving employee')
  let employee = await Employee.create({
    surname: req.body.surname,
    second_surname: req.body.second_surname,
    firstname: req.body.firstname,
    midlename: req.body.midlename,
    country: req.body.country,
    id_type: req.body.id_type,
    id_number: req.body.id_number,
    email: generatedEmail,
    start_date: startDate,
    area: req.body.area,
    status: req.body.status,
    register_date: registerDate,
    edition_date: registerDate,
    
  });
  employee.save();
  req.flash('success', 'employee Added');
  res.send('employee added')
  console.log('employee added')
  console.log(employee)
  res.redirect('/');
  
  } catch (e) {
    res.send(e);
  }

});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const employee = await employee.findById(req.params.id);
    if (employee.author != req.user._id) {
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }
    res.render('edit_employee', {
      title: 'Edit employee',
      employee: employee
    });

  } catch (e) {
    res.send(e);
  }

});

// Update Submit POST Route
router.post('/edit/:id', async (req, res) => {
  try {
    const employee = {
      title: req.body.title,
      author: req.body.name,
      body: req.body.body
    };

    let query = { _id: req.params.id }

    const update = await employee.update(query, employee);
    if (update) {
      req.flash('success', 'employee Updated');
      res.redirect('/');
    } return;

  } catch (e) {
    res.send(e);
  }

});

// Delete employee
router.delete('/:id', async (req, res) => {

  try {
    if (!req.user._id) {
      res.status(500).send();
    }
    let query = { _id: req.params.id }
    const employee = await employee.findById(req.params.id);

    if (employee.author != req.user._id) {
      res.status(500).send();
    } else {
      remove = await employee.findByIdAndRemove(query);
      if (remove) {
        res.send('Success');
      }
    };
  } catch (e) {
    res.send(e);
  }

});



// Get Single employee
router.get('/:id', async (req, res) => {

  const employee = await employee.findById(req.params.id);
  const user = await User.findById(employee.author);
  if (user) {
    res.render('employee', {
      employee: employee,
      author: user.name
    });
  }
});

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;