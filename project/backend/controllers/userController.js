// backend/controllers/userController.js
const User = require('../models/User');

async function createUser(username, password) {
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    console.log('User created:', newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

module.exports = { createUser };
