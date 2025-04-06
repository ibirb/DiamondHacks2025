// backend/controllers/savingGoalController.js
const SavingGoal = require('../models/SavingGoal');
const Expense = require('../models/Expense');
const User = require('../models/User');

async function updateAmountSavedAutomatically(userId) {
  console.log("--------------------------------------------------");
  console.log(`updateAmountSavedAutomatically called for userId: ${userId}`);
  try {
    // Find the user's active saving goal
    console.log('Finding active saving goal...');
    const activeGoal = await SavingGoal.findOne({ userId, isActive: true });
    if (!activeGoal) {
      console.log('No active saving goal found for user:', userId);
      console.log("--------------------------------------------------");
      return;
    }
    console.log('Active goal found:', activeGoal);

    // Find the user's daily spending goal
    console.log('Finding user data...');
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found:', userId);
      console.log("--------------------------------------------------");
      return;
    }
    console.log('User data found:', user);
    const dailySpendingGoal = user.dailySpendingGoal;
    console.log(`dailySpendingGoal: ${dailySpendingGoal}`);

    // Calculate the start date for expense tracking
    const startDate = activeGoal.startDate;
    console.log(`startDate: ${startDate}`);
    const today = new Date();
    console.log(`today: ${today}`);

    // Calculate the total number of days since the start date
    const daysSinceStart = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    console.log(`daysSinceStart: ${daysSinceStart}`);

    // Get the user's expenses since the saving goal start date
    console.log('Finding expenses since:', startDate);
    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate },
    });
    console.log(`Expenses found:`, expenses);

    // Calculate the total spent since the start date
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.cost, 0);
    console.log(`totalSpent: ${totalSpent}`);

    // Calculate the total allowed spending
    const totalAllowedSpending = dailySpendingGoal * daysSinceStart;
    console.log(`totalAllowedSpending: ${totalAllowedSpending}`);

    // Calculate the amount saved
    const amountSaved = Math.max(0, totalAllowedSpending - totalSpent);
    console.log(`amountSaved: ${amountSaved}`);

    // Update the amountSaved in the database
    activeGoal.amountSaved = amountSaved;
    await activeGoal.save();

    console.log(
      `Amount saved updated for user ${userId}: ${activeGoal.amountSaved}`
    );
    console.log("--------------------------------------------------");
  } catch (error) {
    console.error('Error updating amount saved:', error);
    console.log("--------------------------------------------------");
  }
}

async function getActiveSavingGoal(userId) {
  try {
    const goal = await SavingGoal.findOne({ userId, isActive: true });
    return goal;
  } catch (error) {
    console.error('Error getting active saving goal:', error);
    throw error;
  }
}

async function createSavingGoal(userId, goalName, totalAmount, deadline) {
  try {
    // Check if an active goal already exists
    const existingGoal = await SavingGoal.findOne({ userId, isActive: true });
    if (existingGoal) {
      throw new Error('An active saving goal already exists.');
    }

    const newSavingGoal = new SavingGoal({ userId, goalName, totalAmount, deadline });
    await newSavingGoal.save();
    return newSavingGoal;
  } catch (error) {
    console.error('Error creating saving goal:', error);
    throw error;
  }
}

module.exports = { getActiveSavingGoal, createSavingGoal, updateAmountSavedAutomatically };
