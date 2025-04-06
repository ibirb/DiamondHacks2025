// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true, // Name is now required
  },
  dailySpendingGoal: {
    type: Number,
    required: true, // Daily spending goal is now required
  },
  // You can add more fields here, like email, etc.
});

// Auto-incrementing ID plugin
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const doc = this;
    const Model = doc.constructor;
    const maxId = await Model.findOne().sort({ _id: -1 }).exec();
    doc._id = maxId ? maxId._id + 1 : 1;
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
