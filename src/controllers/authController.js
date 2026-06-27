const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const worker = await User.findOne({ email });
    if (!worker || !(await bcrypt.compare(password, worker.password))) {
      return res.status(401).json({ message: 'Security parameters identification error.' });
    }
    const internalSignature = jwt.sign({ id: worker._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(200).json({
      token: internalSignature,
      user: { id: worker._id, username: worker.username, email: worker.email, role: worker.role, fullName: worker.fullName }
    });
  } catch (err) { next(err); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const staff = await User.findOne({ email });
    if (!staff) return res.status(200).json({ message: 'If credentials match operational vectors, an access pass is on its way.' });

    const standardOtp = Math.floor(100000 + Math.random() * 900000).toString();
    staff.resetPasswordOtp = standardOtp;
    staff.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await staff.save();

    await sendEmail(email, "System Infrastructure Access Security Code", `<h3>Authorization Code</h3><p>Your systems verification key is: <strong>${standardOtp}</strong></p>`);
    res.status(200).json({ message: 'Security token OTP successfully dispatched to target account email.' });
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const individual = await User.findOne({ email, resetPasswordOtp: otp, resetPasswordExpires: { $gt: Date.now() } });
    if (!individual) return res.status(400).json({ message: 'Verification token invalidation or timeframe drop context.' });

    const protectiveSalt = await bcrypt.genSalt(12);
    individual.password = await bcrypt.hash(newPassword, protectiveSalt);
    individual.resetPasswordOtp = null;
    individual.resetPasswordExpires = null;
    await individual.save();

    res.status(200).json({ message: 'Security network rotated credential structures successfully finalized.' });
  } catch (err) { next(err); }
};

exports.getProfile = async (req, res, next) => {
  try {
    res.status(200).json(await User.findById(req.user.id).select('-password'));
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, email, bio } = req.body;
    const employee = await User.findById(req.user.id);
    if (email && email !== employee.email) {
      if (await User.findOne({ email })) return res.status(400).json({ message: 'Identity parameters map directly to an active profile.' });
      employee.email = email;
    }
    if (fullName) employee.fullName = fullName;
    if (bio !== undefined) employee.bio = bio;
    if (req.file) employee.avatar = req.file.path;
    await employee.save();
    res.status(200).json({ message: 'Profile updates committed successfully.', user: employee });
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userProfile = await User.findById(req.user.id);
    if (!(await bcrypt.compare(currentPassword, userProfile.password))) {
      return res.status(400).json({ message: 'Current credentials identification error tracking failure.' });
    }
    const freshSalt = await bcrypt.genSalt(12);
    userProfile.password = await bcrypt.hash(newPassword, freshSalt);
    await userProfile.save();
    res.status(200).json({ message: 'Security password rotation process executed smoothly.' });
  } catch (err) { next(err); }
};
