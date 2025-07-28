const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // optional if anonymous
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  rating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  orderId: { type: String },  // for purchase verification
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
