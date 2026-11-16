const express = require('express');
const {
  getAnalytics,
  getAllUsers,
  updateUserByAdmin,
  deleteUser,
  getAllDestinationsAdmin,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, admin);

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserByAdmin);
router.delete('/users/:id', deleteUser);
router.get('/destinations', getAllDestinationsAdmin);

module.exports = router;
