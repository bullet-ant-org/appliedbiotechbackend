const News = require('../models/News');

exports.createNews = async (req, res, next) => {
  try {
    const structuralPacket = req.body;
    if (req.file) structuralPacket.coverImage = req.file.path;
    if (typeof structuralPacket.body === 'string') structuralPacket.body = JSON.parse(structuralPacket.body);
    res.status(201).json(await News.create(structuralPacket));
  } catch (err) { next(err); }
};

exports.getNews = async (req, res, next) => {
  try {
    res.status(200).json(await News.find().sort({ date: -1 }));
  } catch (err) { next(err); }
};

exports.getNewsById = async (req, res, next) => {
  try {
    const element = await News.findById(req.params.id);
    if (!element) return res.status(404).json({ message: 'Article execution lookup parameter unmatched.' });
    res.status(200).json(element);
  } catch (err) { next(err); }
};

exports.updateNews = async (req, res, next) => {
  try {
    const modifications = req.body;
    if (req.file) modifications.coverImage = req.file.path;
    if (typeof modifications.body === 'string') modifications.body = JSON.parse(modifications.body);
    res.status(200).json(await News.findByIdAndUpdate(req.params.id, modifications, { new: true }));
  } catch (err) { next(err); }
};

exports.deleteNewsArticle = async (req, res, next) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'News communication structural node deleted.' });
  } catch (err) { next(err); }
};
