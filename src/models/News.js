const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  coverImage: { type: String, required: true },
  title: { type: String, required: true },
  tag: { type: String, required: true },
  date: { type: Date, default: Date.now },
  excerpt: { type: String, required: true },
  body: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

module.exports = mongoose.model('News', NewsSchema);
