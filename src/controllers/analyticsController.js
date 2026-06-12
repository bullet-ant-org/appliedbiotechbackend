const Analytics = require('../models/Analytics');

exports.trackVisit = async (req, res, next) => {
  try {
    const { page } = req.body;
    res.status(200).json(await Analytics.findOneAndUpdate({ page }, { $inc: { views: 1 } }, { upsert: true, new: true }));
  } catch (err) { next(err); }
};

exports.getAnalytics = async (req, res, next) => {
  try { res.status(200).json(await Analytics.find()); } catch (err) { next(err); }
};
