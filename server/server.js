const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to database (only if MONGO_URI is provided)
if (process.env.MONGO_URI && process.env.USE_MOCK_DATA !== 'true') {
  connectDB();
} else {
  console.log('🗃️ Using mock data (MongoDB not connected)');
}

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api', require('./routes/api'));

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Service Navigator API is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 API Base URL: http://localhost:${PORT}/api`);
});
