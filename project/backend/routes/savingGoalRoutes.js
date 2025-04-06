// backend/routes/savingGoalRoutes.js
const express = require('express');
const router = express.Router();
const {
  getActiveSavingGoal,
  createSavingGoal,
  updateSavingGoal,
} = require('../controllers/savingGoalController');

// Route to check for an active saving goal
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const goal = await getActiveSavingGoal(userId);
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to create a new saving goal
router.post('/', async (req, res) => {
  try {
    const { userId, goalName, totalAmount, deadline } = req.body;
    const newGoal = await createSavingGoal(userId, goalName, totalAmount, deadline);
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to update a saving goal
router.put('/:goalId', async (req, res) => {
  try {
    const goalId = req.params.goalId;
    const { amountSaved } = req.body;
    const updatedGoal = await updateSavingGoal(goalId, amountSaved);
    res.json(updatedGoal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
