const Gallery = require('../models/Gallery');

exports.getGalleryItems = async (req, res, next) => {
  try {
    res.status(200).json(await Gallery.find().sort({ createdAt: -1 }));
  } catch (err) { next(err); }
};

exports.getGalleryItemById = async (req, res, next) => {
  try {
    const fileNode = await Gallery.findById(req.params.id);
    if (!fileNode) return res.status(404).json({ message: 'Asset untraceable.' });
    res.status(200).json(fileNode);
  } catch (err) { next(err); }
};

exports.uploadToGallery = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Visual asset raw media payload missing.' });
    const dynamicEntity = await Gallery.create({
      url: req.file.path,
      publicId: req.file.filename,
      name: req.body.name || 'Unclassified Applied Asset Reference',
      description: req.body.description || 'Corporate system standard binary allocation upload context.'
    });
    res.status(201).json({ message: 'Assets successfully mapped and tracked into centralized vault.', dynamicEntity });
  } catch (err) { next(err); }
};

exports.deleteGalleryAsset = async (req, res, next) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Media node successfully severed.' });
  } catch (err) { next(err); }
};
