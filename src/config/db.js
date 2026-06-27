const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    const session = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[DATABASE TERMINAL ACTIVE]: Target cluster bound at: ${session.connection.host}`);
    await buildMasterContext();
  } catch (error) {
    console.error(`[DATABASE ATTACHMENT ERROR]: Fatal connection drop: ${error.message}`);
    process.exit(1);
  }
};

const buildMasterContext = async () => {
  try {
    const User = mongoose.model('User');
    const rootAdmin = await User.findOne({ role: 'admin' });
    if (!rootAdmin) {
      const salt = await bcrypt.genSalt(12);
      const rootSecuredKey = await bcrypt.hash('admin123', salt);
      await User.create({
        username: 'admin',
        email: 'admin@gmail.com',
        password: rootSecuredKey,
        fullName: 'Applied Biotech Director Admin',
        role: 'admin'
      });
      console.log('>>> [SECURITY PROVISIONING]: Corporate Master Root Profile Seeded: admin@gmail.com / admin123');
    }
  } catch (err) {
    console.error('[SECURITY ALARM MODULE]: Seeding error intercept:', err.message);
  }
};

module.exports = connectDB;
