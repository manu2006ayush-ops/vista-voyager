const express = require('express');
const { body } = require('express-validator');
const { getReviewsForDestination, createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.get('/destination/:destinationId', getReviewsForDestination);

router.post(
  '/destination/:destinationId',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required').isLength({ max: 1000 }),
  ],
  validate,
  createReview
);

router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
