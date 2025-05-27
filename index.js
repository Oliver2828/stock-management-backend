// index.js
const express      = require('express');
const dotenv       = require('dotenv');
const cors         = require('cors');
const mongoose     = require('mongoose');
const cookieParser = require('cookie-parser');

dotenv.config();

const PORT      = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌  Fatal Error: MONGO_URI is not defined');
  process.exit(1);
}

const app = express();

// CORS
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount routes
const authRoutes  = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
app.use('/api/auth',  authRoutes);
app.use('/api/stock', stockRoutes);

// Import and use general auth middleware (for testing)
const { auth } = require('./middleware/auth');
app.get('/api/protected', auth, (req, res) => {
  res.json({
    message: 'Protected route accessed successfully',
    user:    req.user
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status:   'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️  MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀  Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌  Startup failed:', err.message);
    process.exit(1);
  }
};

startServer();
