const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  collectionName: { type: String, required: true, unique: true },
  coverImage: { type: String, required: true },
  description: { type: String, required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  status: { type: String, enum: ['published', 'unpublished'], default: 'published' }
}, { timestamps: true });

module.exports = mongoose.model('Collection', CollectionSchema);
