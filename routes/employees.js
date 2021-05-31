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
router.get('/edit/:id_number', ensureAuthenticated, async (req, res) => {
  try {
    const employee = await Employee.findOne({id_number: req.params.id_number});
    console.log('req.params.id_number')
    console.log(req.params.id_number)
    if (!employee) {
      req.flash('danger', 'Not Authorized');
      return res.redirect('/');
    }
    console.log('employee')
    console.log(employee)
    res.render('edit_employee', {
      employee: employee
    });

  } catch (e) {
    res.send(e);
  }

});

// Update Submit POST Route
router.post('/edit/:id_number', async (req, res) => {
  try {

    console.log('starting update process')
    const employee = await Employee.findOne({id_number: req.params.id_number});
    currentEmail = employee.email
    
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

    console.log('employee._id1')
    console.log(employee._id)
   
    while (employee && employee.email == generatedEmail) {
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
      console.log(startDate)
    } else {
      res.send('invalid date format, should be: DD/MM/YYYY')
    }
  
    console.log('starting to update')
    let editionDate = new Date(Date.now())

    console.log('employee._id2')
    console.log(employee._id)
   
    const employee_params = {
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
      edition_date: editionDate,
    };

    console.log('employee._id3')
    console.log(employee._id)
   
    const update = await Employee.findByIdAndUpdate(employee._id, employee_params, {new: true});
    console.log('update')
    console.log(update)
    if (update) {
      req.flash('success', 'employee Updated');
      res.send('succesfully updated')
      res.redirect('/');
    } return;

  } catch (e) {
    res.send(e);
  }

});



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;