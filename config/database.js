const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function() {
    console.log(`MongoDB Connected: ${db.host}`);
  });
  
};

module.exports = connectDB
