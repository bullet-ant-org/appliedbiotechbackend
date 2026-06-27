const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  page: { type: String, enum: ['landing', 'shop'], required: true },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Analytics', AnalyticsSchema);
