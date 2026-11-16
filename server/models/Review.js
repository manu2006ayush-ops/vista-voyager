const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 100 },
    comment: { type: String, required: true, maxlength: 1000 },
    tripType: { type: String, enum: ['solo', 'family', 'romantic', 'adventure', 'budget'], default: 'solo' },
    helpfulCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, destination: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
