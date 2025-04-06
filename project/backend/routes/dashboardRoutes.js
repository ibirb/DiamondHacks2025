// backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const dashboardData = await dashboardController.getDashboardData(userId);
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
