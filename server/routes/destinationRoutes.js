const express = require('express');
const { body } = require('express-validator');
const {
  getDestinations,
  getDestinationBySlug,
  getRecommendations,
  getFeatured,
  getFilterMeta,
  createDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinationController');
const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.get('/', getDestinations);
router.get('/featured/top', getFeatured);
router.get('/meta/filters', getFilterMeta);
router.get('/recommendations/for-you', protect, getRecommendations);
router.get('/:slug', getDestinationBySlug);

router.post(
  '/',
  protect,
  admin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('location.lat').isFloat().withMessage('Latitude is required'),
    body('location.lng').isFloat().withMessage('Longitude is required'),
  ],
  validate,
  createDestination
);

router.put('/:id', protect, admin, updateDestination);
router.delete('/:id', protect, admin, deleteDestination);

module.exports = router;
