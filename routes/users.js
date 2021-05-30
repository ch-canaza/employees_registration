const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const passport = require('passport');
const { User } = require('../models/user');
//const mongoose = require('mongoose');
//const conn = mongoose.createConnection('mongodb://localhost/test');
//const User = conn.model('User');

// signup Form
router.get('/signup', async (req, res) => {
  res.render('signup');
});

// signup Proccess
router.post('/signup', async (req, res) => {

  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  const salt = await bcrypt.genSalt(10);
  const newUser = User.create({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, salt)
  }, function (err, user){
    if (err) handleError(err);
      console.log('user saved')
      console.log(user)

  });
 
  req.flash('success', 'You just signed up and now can log in');
  res.redirect('/users/login');
});

// Login Form
router.get('/login', async (req, res) => {
  res.render('login');
});

// Login Process
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/employees/add',
    failureRedirect: '/users/signup'
  })
);
  

// Logout
router.get('/logout', async (req, res) => {
  req.logout();
  req.flash('success', 'You just logged out');
  res.redirect('/users/login');
});

module.exports = router;
