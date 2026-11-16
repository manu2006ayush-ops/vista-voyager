const express = require('express');
const { chatWithBot } = require('../controllers/chatbotController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Optional auth: attach user if token present, but don't require it
const optionalAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer')) {
    try {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      req.user = null;
    }
  }
  next();
};

router.post('/message', optionalAuth, chatWithBot);

module.exports = router;
