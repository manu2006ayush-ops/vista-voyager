const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 200 },
    images: { type: [String], default: [] },
    coverImage: { type: String, default: '' },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    categories: {
      type: [String],
      enum: ['solo', 'family', 'romantic', 'adventure', 'budget'],
      default: [],
    },
    tags: { type: [String], default: [] },
    bestTimeToVisit: { type: String, default: '' },
    avgBudgetPerDay: {
      low: { type: Number, default: 1500 },
      medium: { type: Number, default: 4000 },
      high: { type: Number, default: 10000 },
    },
    activities: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    popularity: { type: Number, default: 0 },
    famousFor: { type: [String], default: [] },
    nearbyAttractions: { type: [String], default: [] },
    idealTripDuration: { type: Number, default: 3 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

destinationSchema.index({ name: 'text', city: 'text', state: 'text', tags: 'text', description: 'text' });

module.exports = mongoose.model('Destination', destinationSchema);
