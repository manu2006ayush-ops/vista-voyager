const express = require('express');
const { body } = require('express-validator');
const {
  generateAndSaveItinerary,
  getMyItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary,
} = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect);

router.post(
  '/generate',
  [
    body('destinationId').notEmpty().withMessage('Destination is required'),
    body('duration').isInt({ min: 1, max: 30 }).withMessage('Duration must be between 1 and 30 days'),
    body('tripType').isIn(['solo', 'family', 'romantic', 'adventure', 'budget']),
    body('budgetLevel').isIn(['low', 'medium', 'high']),
  ],
  validate,
  generateAndSaveItinerary
);

router.get('/', getMyItineraries);
router.get('/:id', getItineraryById);
router.put('/:id', updateItinerary);
router.delete('/:id', deleteItinerary);

module.exports = router;
