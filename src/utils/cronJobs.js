const cron = require('node-cron');
const Order = require('../models/Order');

const initCronJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON JOBS ACTIVATED]: Clearing stagnant transaction logs from production cache...');
    const expirationLimit = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    try {
      const recordsPurged = await Order.deleteMany({ status: 'pending', createdAt: { $lt: expirationLimit } });
      console.log(`[CRON COMPLETION MAP]: Swept ${recordsPurged.deletedCount} unfulfilled transactions.`);
    } catch (err) {
      console.error('[CRON FAULT EXCEPTION]: Base sweep loop failure:', err.message);
    }
  });
};

module.exports = initCronJobs;
