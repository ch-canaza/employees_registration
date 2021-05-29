const mongoose = require('mongoose');

const mySchema = mongoose.Schema;
const UserSchema = new mySchema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);
module.exports.User = User