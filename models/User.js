const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'seller', 'customer'], default: 'seller' },
  createdAt: { type: Date, default: Date.now },
  marketplaces: [{
    platform: String,
    sellerId: String
  }]
});

module.exports = mongoose.model('User', UserSchema);
