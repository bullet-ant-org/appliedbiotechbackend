const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  career: { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  location: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  cvUrl: { type: String, required: true },
  passportUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
