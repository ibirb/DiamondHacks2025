// backend/db.js
const mongoose = require('mongoose');

// Replace <db_password> with your actual password
const uri = 'mongodb+srv://root:MyPassword@users.rzqfs1w.mongodb.net/?retryWrites=true&w=majority&appName=Users';

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB using Mongoose!');
  } catch (err) {
    console.error('Error connecting to MongoDB with Mongoose:', err);
    process.exit(1); // Exit process with failure
  }
}

module.exports = connectToDatabase;
