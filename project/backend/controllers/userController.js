// backend/controllers/userController.js
const User = require('../models/User');

async function createUser(username, password) {
  try {
    const newUser = new User({ username, password });
    // Manually trigger the pre('save') middleware to set the _id
    await newUser.constructor.findOne().sort({ _id: -1 }).exec().then(async (maxId) => {
      newUser._id = maxId ? maxId._id + 1 : 1;
      await newUser.validate();
    });
    await newUser.save();
    console.log('User created:', newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

module.exports = { createUser };
