const Destination = require('../models/Destination');
const { getPersonalizedRecommendations } = require('./recommendationService');

/**
 * Vista Voyager AI Travel Chatbot.
 *
 * Works fully offline using intent detection + entity extraction against
 * the destinations database (no external API key required). If
 * process.env.AI_PROVIDER_API_KEY is set, callExternalAI() can be wired
 * to call an LLM (OpenAI/Anthropic/etc.) for more natural responses —
 * the rest of the app does not need to change.
 */

const INTENTS = [
  { name: 'greeting', patterns: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good evening'] },
  { name: 'budget', patterns: ['budget', 'cost', 'price', 'cheap', 'expensive', 'how much'] },
  { name: 'weather', patterns: ['weather', 'climate', 'temperature', 'rain', 'season'] },
  { name: 'recommend', patterns: ['recommend', 'suggest', 'where should i go', 'best place', 'plan a trip'] },
  { name: 'family', patterns: ['family', 'kids', 'children'] },
  { name: 'romantic', patterns: ['romantic', 'honeymoon', 'couple'] },
  { name: 'adventure', patterns: ['adventure', 'trekking', 'hiking', 'thrill'] },
  { name: 'solo', patterns: ['solo', 'alone', 'backpacking'] },
  { name: 'thanks', patterns: ['thanks', 'thank you', 'great', 'awesome'] },
];

const detectIntent = (message) => {
  const lower = message.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.patterns.some((p) => lower.includes(p))) return intent.name;
  }
  return 'unknown';
};

const extractDestinationMention = async (message) => {
  const lower = message.toLowerCase();
  const destinations = await Destination.find({ isActive: true }).select('name city state slug').lean();
  return destinations.find(
    (d) => lower.includes(d.name.toLowerCase()) || lower.includes(d.city.toLowerCase()) || lower.includes(d.state.toLowerCase())
  );
};

const buildReply = async (intent, message, user, mentionedDestination) => {
  switch (intent) {
    case 'greeting':
      return `Namaste${user ? ' ' + user.name.split(' ')[0] : ''}! I'm Voya, your Vista Voyager travel assistant. Ask me about destinations, budgets, weather, or say "recommend me a trip"!`;

    case 'budget': {
      if (mentionedDestination) {
        const dest = await Destination.findById(mentionedDestination._id);
        return `For ${dest.name}, a rough daily budget is ₹${dest.avgBudgetPerDay.low} (budget), ₹${dest.avgBudgetPerDay.medium} (mid-range), or ₹${dest.avgBudgetPerDay.high} (luxury) per person. Want a full trip budget estimate? Use the Budget Planner!`;
      }
      return `Budgets vary a lot by destination in India — hill stations and beaches can be done for ₹1500-3000/day, while premium destinations run ₹6000+/day. Tell me a place and I'll break it down!`;
    }

    case 'weather':
      if (mentionedDestination) {
        return `You can check live weather and a 7-day forecast for ${mentionedDestination.name} on its destination page — I pull that from live weather data automatically.`;
      }
      return `Tell me which destination you're curious about and I'll point you to its live weather forecast!`;

    case 'recommend': {
      const recs = await getPersonalizedRecommendations(user, 3);
      const names = recs.map((r) => r.name).join(', ');
      return recs.length
        ? `Based on your travel preferences, you might love: ${names}. Want a day-wise itinerary for any of these?`
        : `Tell me a bit about your travel style (solo, family, romantic, adventure, or budget) and I'll suggest great Indian destinations!`;
    }

    case 'family':
      return `For family trips, popular picks include hill stations with easy sightseeing and beach destinations with resorts. Try filtering the Explorer page by the "Family" category!`;

    case 'romantic':
      return `For a romantic getaway, hill stations, backwaters, and heritage cities are top picks. Filter by "Romantic" in the Destination Explorer to see curated spots.`;

    case 'adventure':
      return `Looking for adventure? Mountain and trekking destinations with activities like river rafting, paragliding, and trekking are tagged "Adventure" in our explorer.`;

    case 'solo':
      return `Solo travel is best in destinations with good hostels, safety, and a social traveler scene. Check the "Solo" category filter in the Explorer!`;

    case 'thanks':
      return `You're welcome! Happy travels. 🧳✈️`;

    default:
      return `I can help you find destinations, estimate budgets, check weather, and build itineraries. Try asking: "Suggest a romantic destination" or "What's the budget for Goa?"`;
  }
};

const getChatResponse = async (message, user) => {
  const intent = detectIntent(message);
  const mentionedDestination = await extractDestinationMention(message);
  const reply = await buildReply(intent, message, user, mentionedDestination);
  return { reply, intent, mentionedDestination: mentionedDestination ? mentionedDestination.name : null };
};

module.exports = { getChatResponse, detectIntent };
