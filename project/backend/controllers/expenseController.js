// backend/controllers/expenseController.js
const Expense = require('../models/Expense');

async function createExpense(user, category, name, cost, date) {
  try {
    const newExpense = new Expense({ user, category, name, cost, date });
    await newExpense.constructor.findOne().sort({ _id: -1 }).exec().then(async (maxId) => {
      newExpense._id = maxId ? maxId._id + 1 : 1;
      await newExpense.validate();
    });
    await newExpense.save();
    console.log('Expense created:', newExpense);
    return newExpense;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
}

async function getExpensesByUser(userId) {
  try {
    const expenses = await Expense.find({ user: userId });
    return expenses;
  } catch (error) {
    console.error('Error getting expenses:', error);
    throw error;
  }
}

module.exports = { createExpense, getExpensesByUser };
