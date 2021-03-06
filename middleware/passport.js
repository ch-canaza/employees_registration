const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/user');
const bcrypt = require('bcrypt');



module.exports = function (passport) {
  // Local Strategy
  passport.use(new LocalStrategy(function (username, password, done) {
    // Match Username
    let query = { username: username };
    console.log(username)
    User.findOne(query, function (err, user) {
      if (err) throw err;
      if (!user) {
        console.log('no user found')
        return done(null, false, { message: 'No user found' });
      }

      // Match Password
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          console.log('password matched')
          return done(null, user);
        } else {
          console.log('wrong password')
          return done(null, false, { message: 'Wrong password' });
        }
      });
    });
  }));

  passport.serializeUser(function (user, done) {
    console.log(user)
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      console.log(user)
      done(err, user);
    });
  });
}
