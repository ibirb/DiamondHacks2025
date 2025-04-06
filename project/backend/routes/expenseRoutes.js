// backend/routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const { createExpense, getExpensesByUser, getExpensesByDate } = require('../controllers/expenseController');

// API endpoint to create a new expense
router.post('/', async (req, res) => {
  const { user, category, name, cost, date } = req.body;

  if (!user || !category || !name || !cost || !date) {
    return res
      .status(400)
      .json({ error: 'User, category, name, cost, and date are required' });
  }

  try {
    const newExpense = await createExpense(user, category, name, cost, date);
    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error in POST /api/expenses:', error); // Log the full error
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// API endpoint to get expenses by user
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const expenses = await getExpensesByUser(userId);
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error in GET /api/expenses/:userId:', error); // Log the full error
    res.status(500).json({ error: 'Failed to get expenses' });
  }
});

// API endpoint to get expenses by date
router.get('/:userId/:startDate/:endDate', async (req, res) => {
  const { userId, startDate, endDate } = req.params;
  try {
    const expenses = await getExpensesByDate(userId, startDate, endDate);
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error in GET /api/expenses/:userId/:startDate/:endDate:', error);
    res.status(500).json({ error: 'Failed to get expenses by date' });
  }
});

module.exports = router;
