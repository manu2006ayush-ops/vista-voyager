/**
 * Budget planner / expense estimator.
 * Produces a category-wise breakdown for a trip based on destination
 * cost data, duration, number of travelers, and budget tier.
 */

const CATEGORY_SPLIT = {
  accommodation: 0.35,
  food: 0.2,
  transport: 0.2,
  activities: 0.15,
  shopping: 0.05,
  misc: 0.05,
};

const estimateBudget = ({ destination, duration, budgetLevel = 'medium', travelers = 1 }) => {
  const perDay = destination.avgBudgetPerDay?.[budgetLevel] || destination.avgBudgetPerDay?.medium || 3000;
  const total = perDay * duration * travelers;

  const breakdown = {};
  Object.entries(CATEGORY_SPLIT).forEach(([key, pct]) => {
    breakdown[key] = Math.round(total * pct);
  });

  return {
    perDayPerPerson: perDay,
    duration,
    travelers,
    budgetLevel,
    totalEstimated: Math.round(total),
    breakdown,
  };
};

module.exports = { estimateBudget };
