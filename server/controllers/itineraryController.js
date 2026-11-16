const asyncHandler = require('express-async-handler');
const Itinerary = require('../models/Itinerary');
const Destination = require('../models/Destination');
const { generateItinerary } = require('../services/itineraryService');

// @desc    Generate + save an AI day-wise itinerary
// @route   POST /api/itineraries/generate
// @access  Private
const generateAndSaveItinerary = asyncHandler(async (req, res) => {
  const { destinationId, duration, tripType, budgetLevel, travelers, startDate, title } = req.body;

  const destination = await Destination.findById(destinationId);
  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }

  const { days, totalEstimatedBudget } = generateItinerary({
    destination,
    duration: Number(duration),
    tripType,
    budgetLevel,
    travelers: Number(travelers) || 1,
  });

  const itinerary = await Itinerary.create({
    user: req.user._id,
    destination: destination._id,
    title: title || `${duration}-Day ${tripType} Trip to ${destination.name}`,
    tripType,
    duration,
    budgetLevel,
    travelers: travelers || 1,
    startDate,
    days,
    totalEstimatedBudget,
  });

  res.status(201).json({ success: true, data: itinerary });
});

// @desc    Get logged-in user's itineraries
// @route   GET /api/itineraries
// @access  Private
const getMyItineraries = asyncHandler(async (req, res) => {
  const itineraries = await Itinerary.find({ user: req.user._id })
    .populate('destination', 'name city state coverImage')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: itineraries });
});

// @desc    Get single itinerary
// @route   GET /api/itineraries/:id
// @access  Private
const getItineraryById = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findById(req.params.id).populate('destination');
  if (!itinerary) {
    res.status(404);
    throw new Error('Itinerary not found');
  }
  if (itinerary.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this itinerary');
  }
  res.json({ success: true, data: itinerary });
});

// @desc    Update itinerary status/details
// @route   PUT /api/itineraries/:id
// @access  Private
const updateItinerary = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findById(req.params.id);
  if (!itinerary) {
    res.status(404);
    throw new Error('Itinerary not found');
  }
  if (itinerary.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  Object.assign(itinerary, req.body);
  const updated = await itinerary.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete itinerary
// @route   DELETE /api/itineraries/:id
// @access  Private
const deleteItinerary = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findById(req.params.id);
  if (!itinerary) {
    res.status(404);
    throw new Error('Itinerary not found');
  }
  if (itinerary.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  await itinerary.deleteOne();
  res.json({ success: true, message: 'Itinerary deleted' });
});

module.exports = { generateAndSaveItinerary, getMyItineraries, getItineraryById, updateItinerary, deleteItinerary };
