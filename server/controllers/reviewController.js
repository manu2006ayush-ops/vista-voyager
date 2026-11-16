const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Destination = require('../models/Destination');

const recalculateDestinationRating = async (destinationId) => {
  const stats = await Review.aggregate([
    { $match: { destination: destinationId } },
    { $group: { _id: '$destination', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  const update = stats.length
    ? { rating: Math.round(stats[0].avgRating * 10) / 10, numReviews: stats[0].count }
    : { rating: 0, numReviews: 0 };

  await Destination.findByIdAndUpdate(destinationId, update);
};

// @desc    Get reviews for a destination
// @route   GET /api/reviews/destination/:destinationId
// @access  Public
const getReviewsForDestination = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ destination: req.params.destinationId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: reviews });
});

// @desc    Create a review
// @route   POST /api/reviews/destination/:destinationId
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, title, comment, tripType } = req.body;
  const destinationId = req.params.destinationId;

  const existing = await Review.findOne({ user: req.user._id, destination: destinationId });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this destination');
  }

  const review = await Review.create({
    user: req.user._id,
    destination: destinationId,
    rating,
    title,
    comment,
    tripType,
  });

  await recalculateDestinationRating(destinationId);
  await review.populate('user', 'name avatar');

  res.status(201).json({ success: true, data: review });
});

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this review');
  }

  review.rating = req.body.rating ?? review.rating;
  review.title = req.body.title ?? review.title;
  review.comment = req.body.comment ?? review.comment;
  const updated = await review.save();
  await recalculateDestinationRating(review.destination);

  res.json({ success: true, data: updated });
});

// @desc    Delete own review (or admin)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  const destinationId = review.destination;
  await review.deleteOne();
  await recalculateDestinationRating(destinationId);

  res.json({ success: true, message: 'Review removed' });
});

module.exports = { getReviewsForDestination, createReview, updateReview, deleteReview };
