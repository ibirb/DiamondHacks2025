// backend/models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    unique: true,
  },
  user: {
    type: Number,
    ref: 'User', // Reference to the User model
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Food',
      'Transportation',
      'Entertainment',
      'Utilities',
      'Housing',
      'Healthcare',
      'Shopping',
      'Miscellaneous',
    ], // Add this enum
  },
  name: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Auto-incrementing ID plugin
expenseSchema.pre('save', async function (next) {
  if (this.isNew) {
    const doc = this;
    const Model = doc.constructor;
    const maxId = await Model.findOne().sort({ _id: -1 }).exec();
    doc._id = maxId ? maxId._id + 1 : 1;
  }
  next();
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
