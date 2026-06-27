const Product = require('../models/Product');
const DealOfTheWeek = require('../models/DealOfTheWeek');
const FeaturedProduct = require('../models/FeaturedProduct');
const User = require('../models/User');

exports.createProduct = async (req, res, next) => {
  try {
    const structuralData = req.body;
    if (req.file) structuralData.productImage = req.file.path;
    if (typeof structuralData.tags === 'string') {
      try { structuralData.tags = JSON.parse(structuralData.tags); } catch(e) { structuralData.tags = structuralData.tags.split(',').map(t => t.trim()); }
    }
    res.status(201).json(await Product.create(structuralData));
  } catch (err) { next(err); }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const stocklist = await Product.find().sort({ createdAt: -1 });
    const computedStocklist = stocklist.map((item, index) => {
      const obj = item.toObject();
      obj.tags = obj.tags || [];
      if (index === 0 && !obj.tags.includes('new')) obj.tags.push('new');
      if (obj.stock < 5 && obj.stock > 0 && !obj.tags.includes('hot')) obj.tags.push('hot');
      return obj;
    });
    res.status(200).json(computedStocklist);
  } catch (err) { next(err); }
};

exports.getProductBySpecificId = async (req, res, next) => {
  try {
    const lookupItem = await Product.findById(req.params.id);
    if (!lookupItem) return res.status(404).json({ message: 'Product item absent from catalog.' });
    res.status(200).json(lookupItem);
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const updatePayload = req.body;
    if (req.file) updatePayload.productImage = req.file.path;
    if (typeof updatePayload.tags === 'string') {
      try { updatePayload.tags = JSON.parse(updatePayload.tags); } catch(e) { updatePayload.tags = updatePayload.tags.split(',').map(t => t.trim()); }
    }
    res.status(200).json(await Product.findByIdAndUpdate(req.params.id, updatePayload, { new: true }));
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product removed from system inventory.' });
  } catch (err) { next(err); }
};

exports.duplicateProduct = async (req, res, next) => {
  try {
    const targetModel = await Product.findById(req.params.id);
    if (!targetModel) return res.status(404).json({ message: 'Duplication target vector missing.' });
    const duplicateData = targetModel.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    duplicateData.productName = `${duplicateData.productName} (Copy)`;
    res.status(201).json(await Product.create(duplicateData));
  } catch (err) { next(err); }
};

exports.updateDealOfTheWeek = async (req, res, next) => {
  try {
    await DealOfTheWeek.deleteMany({});
    res.status(200).json(await DealOfTheWeek.create(req.body));
  } catch (err) { next(err); }
};

exports.getDealOfTheWeek = async (req, res, next) => {
  try {
    res.status(200).json(await DealOfTheWeek.findOne().populate('product'));
  } catch (err) { next(err); }
};

exports.updateFeaturedProduct = async (req, res, next) => {
  try {
    const items = Array.isArray(req.body) ? req.body : [req.body];
    const valid = items.filter(i => i.name && String(i.name).trim());
    if (valid.length === 0) return res.status(400).json({ message: 'At least one featured item with a name is required.' });
    await FeaturedProduct.deleteMany({});
    const created = await FeaturedProduct.insertMany(
      valid.map(i => ({ name: String(i.name).trim(), description: i.description || '', imageUrl: i.imageUrl || '' }))
    );
    res.status(200).json(created);
  } catch (err) { next(err); }
};

exports.getFeaturedProduct = async (req, res, next) => {
  try {
    res.status(200).json(await FeaturedProduct.find().sort({ createdAt: 1 }));
  } catch (err) { next(err); }
};

exports.manageCartWishlist = async (req, res, next) => {
  try {
    const { action, type, productId, quantity } = req.body;
    const workerProfile = await User.findById(req.user.id);
    if (type === 'wishlist') {
      if (action === 'add') {
        if (!workerProfile.wishlist.includes(productId)) workerProfile.wishlist.push(productId);
      } else {
        workerProfile.wishlist = workerProfile.wishlist.filter(id => id.toString() !== productId);
      }
    } else if (type === 'cart') {
      if (action === 'add') {
        const structuralIndex = workerProfile.cart.findIndex(c => c.product.toString() === productId);
        if (structuralIndex > -1) workerProfile.cart[structuralIndex].quantity += (quantity || 1);
        else workerProfile.cart.push({ product: productId, quantity: quantity || 1 });
      } else {
        workerProfile.cart = workerProfile.cart.filter(c => c.product.toString() !== productId);
      }
    }
    await workerProfile.save();
    res.status(200).json({ message: 'User structural profile asset modified.', user: workerProfile });
  } catch (err) { next(err); }
};
