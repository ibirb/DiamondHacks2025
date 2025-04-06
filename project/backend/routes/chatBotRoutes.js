// backend/routes/chatBotRoutes.js
const express = require('express');
const router = express.Router();
const chatBotController = require('../controllers/chatBotController');

router.post('/chat/:userId', async (req, res) => {
  const { userId } = req.params;
  const { prompt } = req.body;

  try {
    const response = await chatBotController.generateChatResponse(userId, prompt);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
