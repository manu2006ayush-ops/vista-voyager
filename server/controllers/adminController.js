const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Trip = require('../models/Trip');
const Review = require('../models/Review');
const Itinerary = require('../models/Itinerary');

// @desc    Get admin analytics overview
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalDestinations, totalTrips, totalReviews, totalItineraries] = await Promise.all([
    User.countDocuments(),
    Destination.countDocuments(),
    Trip.countDocuments(),
    Review.countDocuments(),
    Itinerary.countDocuments(),
  ]);

  const topDestinations = await Destination.find().sort({ popularity: -1, rating: -1 }).limit(5).select('name rating popularity numReviews');

  const categoryBreakdown = await Destination.aggregate([
    { $unwind: '$categories' },
    { $group: { _id: '$categories', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const tripsByStatus = await Trip.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

  const usersOverTime = await User.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const stateBreakdown = await Destination.aggregate([
    { $group: { _id: '$state', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);

  res.json({
    success: true,
    data: {
      totals: { totalUsers, totalDestinations, totalTrips, totalReviews, totalItineraries },
      topDestinations,
      categoryBreakdown,
      tripsByStatus,
      usersOverTime,
      stateBreakdown,
    },
  });
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (search) {
    query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  }

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit), 100);

  const [users, total] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments(query),
  ]);

  res.json({ success: true, data: users, pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) } });
});

// @desc    Update a user (role, active status) - admin
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.body.role) user.role = req.body.role;
  if (req.body.isActive !== undefined) user.isActive = req.body.isActive;

  const updated = await user.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a user - admin
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own admin account');
  }
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
});

// @desc    Get all destinations for admin management (includes inactive)
// @route   GET /api/admin/destinations
// @access  Private/Admin
const getAllDestinationsAdmin = asyncHandler(async (req, res) => {
  const destinations = await Destination.find().sort({ createdAt: -1 });
  res.json({ success: true, data: destinations });
});

module.exports = { getAnalytics, getAllUsers, updateUserByAdmin, deleteUser, getAllDestinationsAdmin };
