// backend/controllers/savingGoalController.js
const SavingGoal = require('../models/SavingGoal');

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

async function updateSavingGoal(goalId, amountSaved) {
  try {
    const updatedGoal = await SavingGoal.findByIdAndUpdate(
      goalId,
      { amountSaved },
      { new: true }
    );
    if (!updatedGoal) {
      throw new Error('Saving goal not found.');
    }
    return updatedGoal;
  } catch (error) {
    console.error('Error updating saving goal:', error);
    throw error;
  }
}

module.exports = { getActiveSavingGoal, createSavingGoal, updateSavingGoal };
