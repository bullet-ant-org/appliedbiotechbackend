const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  trackingCode: { type: String, required: true, unique: true },
  orderType: { type: String, enum: ['shop', 'academy'], required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  shippingAddress: { type: mongoose.Schema.Types.Mixed, default: null },
  academyUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademyUser', default: null },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  courseItems: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Academy' },
    practicalDate: { type: String },
    price: { type: Number }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'failed'], default: 'pending' },
  eta: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
