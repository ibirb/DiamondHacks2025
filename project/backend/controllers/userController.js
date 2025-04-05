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


async function loginUser(username, password) {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('Invalid username or password');
      }
  
      if (user.password !== password) {
        throw new Error('Invalid username or password');
      }
  
      return user;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  }
  
module.exports = { createUser, loginUser };
