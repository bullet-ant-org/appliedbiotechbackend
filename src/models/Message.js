const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true },
  subject:  { type: String, default: 'Inquiry' },
  message:  { type: String, required: true },
  status:   { type: String, enum: ['unread', 'read'], default: 'unread' },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
