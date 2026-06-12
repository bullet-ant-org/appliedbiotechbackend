const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createAccount = async (req, res, next) => {
  try {
    const { username, email, password, role, fullName } = req.body;
    if (await User.findOne({ $or: [{ email }, { username }] })) {
      return res.status(400).json({ message: 'Profile configurations already operational with target parameters.' });
    }
    const standardSalt = await bcrypt.genSalt(12);
    const keyTransform = await bcrypt.hash(password, standardSalt);
    const corporateAccount = await User.create({ username, email, password: keyTransform, role, fullName });
    res.status(201).json({ message: 'Corporate profile committed successfully.', account: corporateAccount._id });
  } catch (err) { next(err); }
};

exports.getAllAccounts = async (req, res, next) => {
  try {
    res.status(200).json(await User.find().select('-password'));
  } catch (err) { next(err); }
};

exports.modifyRoleTier = async (req, res, next) => {
  try {
    const { role } = req.body;
    const modifiedAccount = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.status(200).json({ message: 'Authorization layer clearance tier shifted.', user: modifiedAccount });
  } catch (err) { next(err); }
};
