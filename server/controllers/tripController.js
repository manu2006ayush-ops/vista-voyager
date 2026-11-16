const asyncHandler = require('express-async-handler');
const Trip = require('../models/Trip');
const Destination = require('../models/Destination');
const { estimateBudget } = require('../services/budgetService');

// @desc    Create a trip
// @route   POST /api/trips
// @access  Private
const createTrip = asyncHandler(async (req, res) => {
  const { destinationId, tripType, startDate, endDate, travelers, budgetLevel } = req.body;

  const destination = await Destination.findById(destinationId);
  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }

  const duration = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)));
  const budgetEstimate = estimateBudget({ destination, duration, budgetLevel: budgetLevel || 'medium', travelers: travelers || 1 });

  const trip = await Trip.create({
    user: req.user._id,
    destination: destinationId,
    tripType,
    startDate,
    endDate,
    travelers: travelers || 1,
    budget: {
      planned: budgetEstimate.totalEstimated,
      spent: 0,
      breakdown: budgetEstimate.breakdown,
    },
  });

  await trip.populate('destination', 'name city state coverImage');
  res.status(201).json({ success: true, data: trip });
});

// @desc    Get logged-in user's trips
// @route   GET /api/trips
// @access  Private
const getMyTrips = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = { user: req.user._id };
  if (status) query.status = status;

  const trips = await Trip.find(query).populate('destination', 'name city state coverImage').sort({ startDate: 1 });
  res.json({ success: true, data: trips });
});

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
const getTripById = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id).populate('destination').populate('itinerary');
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  if (trip.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }
  res.json({ success: true, data: trip });
});

// @desc    Update trip (status, spent amount, notes, link itinerary)
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  if (trip.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const allowedFields = ['status', 'notes', 'itinerary', 'startDate', 'endDate', 'travelers'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) trip[field] = req.body[field];
  });

  if (req.body.budget) {
    trip.budget = { ...trip.budget.toObject(), ...req.body.budget };
  }

  const updated = await trip.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404);
    throw new Error('Trip not found');
  }
  if (trip.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  await trip.deleteOne();
  res.json({ success: true, message: 'Trip deleted' });
});

// @desc    Get budget estimate without creating a trip
// @route   POST /api/trips/estimate-budget
// @access  Private
const estimateTripBudget = asyncHandler(async (req, res) => {
  const { destinationId, duration, budgetLevel, travelers } = req.body;
  const destination = await Destination.findById(destinationId);
  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }
  const estimate = estimateBudget({
    destination,
    duration: Number(duration),
    budgetLevel: budgetLevel || 'medium',
    travelers: Number(travelers) || 1,
  });
  res.json({ success: true, data: estimate });
});

module.exports = { createTrip, getMyTrips, getTripById, updateTrip, deleteTrip, estimateTripBudget };
