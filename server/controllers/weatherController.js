const asyncHandler = require('express-async-handler');
const Destination = require('../models/Destination');
const { getWeatherByCoords } = require('../services/weatherService');

// @desc    Get weather for a destination by slug
// @route   GET /api/weather/:slug
// @access  Public
const getDestinationWeather = asyncHandler(async (req, res) => {
  const destination = await Destination.findOne({ slug: req.params.slug, isActive: true });
  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }

  const weather = await getWeatherByCoords(destination.location.lat, destination.location.lng);
  res.json({ success: true, data: weather });
});

module.exports = { getDestinationWeather };
