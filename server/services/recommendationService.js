const Destination = require('../models/Destination');

/**
 * Rule-based recommendation engine.
 * Scores destinations against a user's stated preferences (travel style,
 * budget range, interests) plus their past wishlist/review activity.
 * This is deterministic and free to run (no external API key needed),
 * but is structured so an external LLM call could be swapped in later
 * via services/aiChatService.js without touching the rest of the app.
 */
const scoreDestination = (destination, preferences = {}) => {
  let score = 0;
  const { travelStyle = [], budgetRange = 'medium', interests = [] } = preferences;

  // Category / travel-style match
  travelStyle.forEach((style) => {
    if (destination.categories.includes(style)) score += 25;
  });

  // Budget match
  if (budgetRange === 'low' && destination.avgBudgetPerDay.low <= 2500) score += 15;
  if (budgetRange === 'medium' && destination.avgBudgetPerDay.medium <= 6000) score += 15;
  if (budgetRange === 'high') score += 10;

  // Interest / tag overlap
  interests.forEach((interest) => {
    const lower = interest.toLowerCase();
    if (
      destination.tags.some((t) => t.toLowerCase().includes(lower)) ||
      destination.activities.some((a) => a.toLowerCase().includes(lower)) ||
      destination.famousFor.some((f) => f.toLowerCase().includes(lower))
    ) {
      score += 10;
    }
  });

  // Popularity & rating as tie-breakers
  score += destination.rating * 4;
  score += Math.min(destination.popularity / 10, 10);

  return score;
};

const getPersonalizedRecommendations = async (user, limit = 8) => {
  const destinations = await Destination.find({ isActive: true }).lean();
  const preferences = (user && user.preferences) || {};

  const scored = destinations.map((d) => ({
    ...d,
    matchScore: scoreDestination(d, preferences),
  }));

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, limit);
};

const getSimilarDestinations = async (destination, limit = 4) => {
  const candidates = await Destination.find({
    _id: { $ne: destination._id },
    isActive: true,
    $or: [
      { categories: { $in: destination.categories } },
      { state: destination.state },
      { tags: { $in: destination.tags } },
    ],
  })
    .limit(limit * 3)
    .lean();

  const scored = candidates.map((d) => {
    let score = 0;
    d.categories.forEach((c) => destination.categories.includes(c) && (score += 20));
    if (d.state === destination.state) score += 10;
    d.tags.forEach((t) => destination.tags.includes(t) && (score += 5));
    score += d.rating * 3;
    return { ...d, matchScore: score };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, limit);
};

module.exports = { getPersonalizedRecommendations, getSimilarDestinations, scoreDestination };
