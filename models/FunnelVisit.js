const mongoose = require('mongoose');

const FunnelVisitSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // optional, could be anonymous
  scannedAt: { type: Date, default: Date.now },
  customerFeedback: { type: String },
  stepData: mongoose.Schema.Types.Mixed      // To store dynamic funnel step data
});

module.exports = mongoose.model('FunnelVisit', FunnelVisitSchema);
