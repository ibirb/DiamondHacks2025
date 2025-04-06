// backend/controllers/dashboardController.js
const User = require('../models/User');
const Expense = require('../models/Expense');

async function getDashboardData(userId) {
  try {
    // Fetch the user's daily spending goal
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const dailySpendingGoal = user.dailySpendingGoal;

    return {
      dailySpendingGoal,
    };
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    throw error;
  }
}

module.exports = { getDashboardData };
