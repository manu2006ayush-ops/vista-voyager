const asyncHandler = require('express-async-handler');
const Destination = require('../models/Destination');
const { getSimilarDestinations, getPersonalizedRecommendations } = require('../services/recommendationService');

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// @desc    Get all destinations with search/filters/pagination
// @route   GET /api/destinations
// @access  Public
const getDestinations = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    state,
    minBudget,
    maxBudget,
    minRating,
    sortBy = 'popularity',
    order = 'desc',
    page = 1,
    limit = 12,
  } = req.query;

  const query = { isActive: true };

  if (search) {
    query.$text = { $search: search };
  }
  if (category) {
    query.categories = { $in: category.split(',') };
  }
  if (state) {
    query.state = { $regex: state, $options: 'i' };
  }
  if (minRating) {
    query.rating = { $gte: Number(minRating) };
  }
  if (minBudget || maxBudget) {
    query['avgBudgetPerDay.medium'] = {};
    if (minBudget) query['avgBudgetPerDay.medium'].$gte = Number(minBudget);
    if (maxBudget) query['avgBudgetPerDay.medium'].$lte = Number(maxBudget);
  }

  const sortOptions = {};
  sortOptions[sortBy] = order === 'asc' ? 1 : -1;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit), 50);

  const [destinations, total] = await Promise.all([
    Destination.find(query)
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Destination.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: destinations,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    },
  });
});

// @desc    Get single destination by slug
// @route   GET /api/destinations/:slug
// @access  Public
const getDestinationBySlug = asyncHandler(async (req, res) => {
  const destination = await Destination.findOne({ slug: req.params.slug, isActive: true });
  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }
  const similar = await getSimilarDestinations(destination, 4);
  res.json({ success: true, data: destination, similar });
});

// @desc    Get personalized recommendations for logged-in user
// @route   GET /api/destinations/recommendations/for-you
// @access  Private
const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await getPersonalizedRecommendations(req.user, 8);
  res.json({ success: true, data: recommendations });
});

// @desc    Get featured/top destinations for landing page
// @route   GET /api/destinations/featured/top
// @access  Public
const getFeatured = asyncHandler(async (req, res) => {
  const destinations = await Destination.find({ isActive: true }).sort({ rating: -1, popularity: -1 }).limit(6);
  res.json({ success: true, data: destinations });
});

// @desc    Get distinct states/categories for filter UI
// @route   GET /api/destinations/meta/filters
// @access  Public
const getFilterMeta = asyncHandler(async (req, res) => {
  const states = await Destination.distinct('state', { isActive: true });
  res.json({
    success: true,
    data: { states: states.sort(), categories: ['solo', 'family', 'romantic', 'adventure', 'budget'] },
  });
});

// @desc    Create destination (admin)
// @route   POST /api/destinations
// @access  Private/Admin
const createDestination = asyncHandler(async (req, res) => {
  const payload = { ...req.body, createdBy: req.user._id };
  if (!payload.slug) payload.slug = slugify(payload.name);

  const exists = await Destination.findOne({ slug: payload.slug });
  if (exists) {
    res.status(400);
    throw new Error('A destination with a similar name already exists');
  }

  const destination = await Destination.create(payload);
  res.status(201).json({ success: true, data: destination });
});

// @desc    Update destination (admin)
// @route   PUT /api/destinations/:id
// @access  Private/Admin
const updateDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }
  Object.assign(destination, req.body);
  const updated = await destination.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete (deactivate) destination (admin)
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }
  destination.isActive = false;
  await destination.save();
  res.json({ success: true, message: 'Destination removed' });
});

module.exports = {
  getDestinations,
  getDestinationBySlug,
  getRecommendations,
  getFeatured,
  getFilterMeta,
  createDestination,
  updateDestination,
  deleteDestination,
};
