const Collection = require('../models/Collection');

exports.createCollection = async (req, res, next) => {
  try {
    const dataset = req.body;
    if (req.file) dataset.coverImage = req.file.path;
    if (typeof dataset.items === 'string') dataset.items = JSON.parse(dataset.items);
    res.status(201).json(await Collection.create(dataset));
  } catch (err) { next(err); }
};

exports.getCollections = async (req, res, next) => {
  try {
    res.status(200).json(await Collection.find().populate('items'));
  } catch (err) { next(err); }
};

exports.getCollectionById = async (req, res, next) => {
  try {
    const entity = await Collection.findById(req.params.id).populate('items');
    if (!entity) return res.status(404).json({ message: 'Collection structural target absent.' });
    res.status(200).json(entity);
  } catch (err) { next(err); }
};

exports.updateCollection = async (req, res, next) => {
  try {
    const modifications = req.body;
    if (req.file) modifications.coverImage = req.file.path;
    if (typeof modifications.items === 'string') modifications.items = JSON.parse(modifications.items);
    res.status(200).json(await Collection.findByIdAndUpdate(req.params.id, modifications, { new: true }));
  } catch (err) { next(err); }
};

exports.deleteCollection = async (req, res, next) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Collection structure destroyed.' });
  } catch (err) { next(err); }
};
