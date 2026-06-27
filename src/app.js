require("./models");
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const initCronJobs = require('./utils/cronJobs');
require('dotenv').config();

const app = express();

connectDB();
initCronJobs();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '50mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { message: 'Network throughput limit exceeded for this node IP location.' }
});
app.use('/api/', limiter);

app.get('/api/v1/health-status', (req, res) => res.status(200).json({ status: 'ONLINE', timestamp: new Date(), version: 'Applied Biotech Engine v4.5' }));

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/shop', require('./routes/shopRoutes'));
app.use('/api/v1/collections', require('./routes/collectionRoutes'));
app.use('/api/v1/academy', require('./routes/academyRoutes'));
app.use('/api/v1/news', require('./routes/newsRoutes'));
app.use('/api/v1/gallery', require('./routes/galleryRoutes'));
app.use('/api/v1/careers', require('./routes/careerRoutes'));
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'));
app.use('/api/v1/content', require('./routes/contentRoutes'));
app.use('/api/v1/payments', require('./routes/paymentRoutes'));
app.use('/api/v1/messages', require('./routes/messageRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[Applied Biotech Production Engine Active]: Secure Channel active on node ${PORT}`));
