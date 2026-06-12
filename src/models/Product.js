const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productImage: { type: String, required: true },
  productName: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  discountedPrice: { type: Number, default: null },
  stock: { type: Number, required: true, default: 0, min: 0 },
  category: { type: String, required: true },
  status: { type: String, enum: ['active', 'draft'], default: 'active' },
  description: { type: String, required: true },
  tags: [{ type: String, default: [] }],
  shippingNote: { type: String, default: "" },
  shippingFee: { type: Number, default: 0, min: 0 },
  shippingType: { type: String, enum: ['standalone', 'bulk'], default: 'standalone' },
  pickupAvailable: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
