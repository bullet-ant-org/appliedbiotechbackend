const mongoose = require('mongoose');

const AcademySchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  levelDescription: { type: String, required: true },
  image: { type: String, required: true },
  outline: [{ type: String, required: true }],
  price: { type: Number, required: true, min: 0 },
  pdfUrl: { type: String, required: true },
  pdfPublicId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Academy', AcademySchema);
