const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');
const Destination = require('../models/Destination');

// @desc    Get logged-in user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('destinations.destination');
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, destinations: [] });
  }
  res.json({ success: true, data: wishlist });
});

// @desc    Add a destination to wishlist
// @route   POST /api/wishlist/:destinationId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.destinationId);
  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, destinations: [] });
  }

  const alreadyExists = wishlist.destinations.some((d) => d.destination.toString() === req.params.destinationId);
  if (alreadyExists) {
    res.status(400);
    throw new Error('Destination already in wishlist');
  }

  wishlist.destinations.push({ destination: destination._id, notes: req.body.notes || '' });
  await wishlist.save();
  await wishlist.populate('destinations.destination');

  res.status(201).json({ success: true, data: wishlist });
});

// @desc    Remove a destination from wishlist
// @route   DELETE /api/wishlist/:destinationId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  wishlist.destinations = wishlist.destinations.filter((d) => d.destination.toString() !== req.params.destinationId);
  await wishlist.save();
  await wishlist.populate('destinations.destination');

  res.json({ success: true, data: wishlist });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
