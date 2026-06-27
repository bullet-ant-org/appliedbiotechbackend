const mongoose = require('mongoose');

const AcademySchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  levelDescription: { type: String, required: true },
  image: { type: String, required: true },
  outline: [{ type: String, required: true }],
  courseType: { type: String, enum: ['modular', 'training'], default: 'modular' },
  trainingDates: [{ type: String }],
  price: { type: Number, required: true, min: 0 },
  pdfUrl: { type: String },
  pdfPublicId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Academy', AcademySchema);
