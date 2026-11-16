const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const Wishlist = require('../models/Wishlist');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;
  user.bio = req.body.bio ?? user.bio;
  user.avatar = req.body.avatar ?? user.avatar;

  if (req.body.preferences) {
    user.preferences = { ...user.preferences.toObject(), ...req.body.preferences };
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updated = await user.save();
  res.json({ success: true, data: updated });
});

// @desc    Get dashboard summary stats for logged-in user
// @route   GET /api/users/dashboard
// @access  Private
const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [upcomingTrips, totalTrips, itineraries, wishlist] = await Promise.all([
    Trip.countDocuments({ user: userId, status: 'upcoming' }),
    Trip.countDocuments({ user: userId }),
    Itinerary.countDocuments({ user: userId }),
    Wishlist.findOne({ user: userId }),
  ]);

  const recentTrips = await Trip.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('destination', 'name city state coverImage');

  res.json({
    success: true,
    data: {
      stats: {
        upcomingTrips,
        totalTrips,
        savedItineraries: itineraries,
        wishlistCount: wishlist ? wishlist.destinations.length : 0,
      },
      recentTrips,
    },
  });
});

module.exports = { updateProfile, getDashboardSummary };
