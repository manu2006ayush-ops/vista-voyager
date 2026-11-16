const asyncHandler = require('express-async-handler');
const { getChatResponse } = require('../services/aiChatService');

// @desc    Chat with Voya, the AI travel assistant
// @route   POST /api/chatbot/message
// @access  Public (works for guests, personalized if logged in)
const chatWithBot = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    res.status(400);
    throw new Error('Message is required');
  }

  const result = await getChatResponse(message, req.user || null);
  res.json({ success: true, data: result });
});

module.exports = { chatWithBot };
