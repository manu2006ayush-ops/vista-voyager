const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    itinerary: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' },
    tripType: { type: String, enum: ['solo', 'family', 'romantic', 'adventure', 'budget'], default: 'solo' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    travelers: { type: Number, default: 1, min: 1 },
    budget: {
      planned: { type: Number, default: 0 },
      spent: { type: Number, default: 0 },
      breakdown: {
        accommodation: { type: Number, default: 0 },
        food: { type: Number, default: 0 },
        transport: { type: Number, default: 0 },
        activities: { type: Number, default: 0 },
        shopping: { type: Number, default: 0 },
        misc: { type: Number, default: 0 },
      },
    },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
