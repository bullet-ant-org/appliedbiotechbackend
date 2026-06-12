const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AcademyUser = require('../models/AcademyUser');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ message: 'Authorization rejected. Staff record mismatch.' });
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Session evaluation verification token expired.' });
    }
  }
  if (!token) return res.status(401).json({ message: 'Access denied. Security Token missing.' });
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access Forbidden: Required role permissions missing.' });
  }
  next();
};

const protectAcademy = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.academyUser = await AcademyUser.findById(decoded.id).select('-password');
      if (!req.academyUser) return res.status(401).json({ message: 'Academy session structural validation failed.' });
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Academy Authentication profile session validation failed.' });
    }
  }
  if (!token) return res.status(401).json({ message: 'Access denied. Student credential tokens required.' });
};

module.exports = { protect, authorize, protectAcademy };
