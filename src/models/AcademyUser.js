const mongoose = require('mongoose');

const AcademyUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  purchasedCourses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Academy' },
    practicalDate: { type: String },
    purchasedAt: { type: Date, default: Date.now }
  }],
  purchasedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('AcademyUser', AcademyUserSchema);
