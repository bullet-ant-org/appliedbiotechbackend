const mongoose = require('mongoose');

const DealOfTheWeekSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  eyebrow: { type: String, required: true },
  headline: { type: String, required: true },
  blurb: { type: String, required: true },
  salePrice: { type: Number, required: true },
  oldPrice: { type: Number, required: true },
  discountLabel: { type: String, required: true },
  dealType: { type: String, enum: ['percentage-off', 'buy-x-get-y-free', 'flat-discount'], default: 'percentage-off' },
  percentageValue: { type: Number, default: 0 },
  purchaseRequirementCount: { type: Number, default: 0 },
  freeRewardCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('DealOfTheWeek', DealOfTheWeekSchema);
