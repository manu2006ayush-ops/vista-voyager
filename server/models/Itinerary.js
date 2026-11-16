const mongoose = require('mongoose');

const daySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, default: '' },
    activities: [
      {
        time: { type: String, default: '' },
        activity: { type: String, required: true },
        location: { type: String, default: '' },
        estimatedCost: { type: Number, default: 0 },
        category: { type: String, default: 'sightseeing' },
      },
    ],
    estimatedDayCost: { type: Number, default: 0 },
  },
  { _id: false }
);

const itinerarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    title: { type: String, required: true },
    tripType: { type: String, enum: ['solo', 'family', 'romantic', 'adventure', 'budget'], default: 'solo' },
    duration: { type: Number, required: true, min: 1, max: 30 },
    budgetLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    travelers: { type: Number, default: 1 },
    startDate: { type: Date },
    days: [daySchema],
    totalEstimatedBudget: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'planned', 'completed'], default: 'draft' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Itinerary', itinerarySchema);
