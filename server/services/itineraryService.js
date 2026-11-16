/**
 * Day-wise itinerary generator.
 * Builds a structured, budget-aware, category-aware plan from a
 * destination's activities/tags without needing any external AI API.
 */

const ACTIVITY_TEMPLATES = {
  morning: ['Explore', 'Visit', 'Guided tour of', 'Sunrise view at'],
  afternoon: ['Lunch near', 'Shopping around', 'Discover', 'Photography session at'],
  evening: ['Sunset at', 'Local food tasting near', 'Relax at', 'Cultural show near'],
};

const BUDGET_MULTIPLIER = { low: 0.7, medium: 1, high: 1.6 };

const pickActivities = (destination, count) => {
  const pool = [
    ...(destination.activities || []),
    ...(destination.famousFor || []),
    ...(destination.nearbyAttractions || []),
  ];
  if (pool.length === 0) return Array(count).fill(destination.name);
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[i % pool.length]);
  }
  return result;
};

const generateItinerary = ({ destination, duration, tripType, budgetLevel, travelers = 1 }) => {
  const multiplier = BUDGET_MULTIPLIER[budgetLevel] || 1;
  const baseDayCost = (destination.avgBudgetPerDay?.[budgetLevel] || destination.avgBudgetPerDay?.medium || 3000) * multiplier;

  const days = [];
  let totalEstimatedBudget = 0;

  for (let day = 1; day <= duration; day++) {
    const activities = pickActivities(destination, 3);

    const dayActivities = [
      {
        time: '08:00 AM',
        activity: `${ACTIVITY_TEMPLATES.morning[day % ACTIVITY_TEMPLATES.morning.length]} ${activities[0]}`,
        location: destination.name,
        estimatedCost: Math.round((baseDayCost * 0.3) / 1),
        category: 'sightseeing',
      },
      {
        time: '01:00 PM',
        activity: `${ACTIVITY_TEMPLATES.afternoon[day % ACTIVITY_TEMPLATES.afternoon.length]} ${activities[1]}`,
        location: destination.name,
        estimatedCost: Math.round(baseDayCost * 0.35),
        category: tripType === 'budget' ? 'food' : 'leisure',
      },
      {
        time: '06:30 PM',
        activity: `${ACTIVITY_TEMPLATES.evening[day % ACTIVITY_TEMPLATES.evening.length]} ${activities[2]}`,
        location: destination.name,
        estimatedCost: Math.round(baseDayCost * 0.35),
        category: 'experience',
      },
    ];

    const estimatedDayCost = dayActivities.reduce((sum, a) => sum + a.estimatedCost, 0) * travelers;
    totalEstimatedBudget += estimatedDayCost;

    days.push({
      day,
      title: day === 1 ? `Arrival & First Impressions` : day === duration ? `Final Day & Departure` : `Day ${day} Exploration`,
      activities: dayActivities,
      estimatedDayCost,
    });
  }

  return { days, totalEstimatedBudget: Math.round(totalEstimatedBudget) };
};

module.exports = { generateItinerary };
