const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
  fullName: { type: String, required: true },
  bio: { type: String, default: '' },
  resetPasswordOtp: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
