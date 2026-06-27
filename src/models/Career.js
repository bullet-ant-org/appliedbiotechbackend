const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  field: { type: String, required: true },
  location: { type: String, required: true },
  jobType: { type: String, required: true },
  spotsAvailable: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Career', CareerSchema);
