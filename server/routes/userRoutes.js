const express = require('express');
const { body } = require('express-validator');
const { updateProfile, getDashboardSummary } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect);

router.put(
  '/profile',
  [
    body('name').optional().trim().isLength({ max: 60 }),
    body('bio').optional().isLength({ max: 300 }),
    body('password').optional().isLength({ min: 6 }),
  ],
  validate,
  updateProfile
);

router.get('/dashboard', getDashboardSummary);

module.exports = router;
