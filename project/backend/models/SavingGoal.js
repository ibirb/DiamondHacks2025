// backend/models/SavingGoal.js
const mongoose = require('mongoose');

const savingGoalSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  goalName: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  deadline: { type: Number, required: true }, // Deadline in days
  startDate: { type: Date, default: Date.now },
  amountSaved: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

const SavingGoal = mongoose.model('SavingGoal', savingGoalSchema);

module.exports = SavingGoal;
