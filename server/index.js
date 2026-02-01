require('dotenv').config({ path: '../.env' });
require('dotenv').config(); // Also check current directory for .env
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const summarizeRoutes = require('./routes/summarize');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting: 10 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    error: 'Too many requests. Please wait a minute before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Routes
app.use('/api', summarizeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from the React app in production
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Handle React routing - send all non-API requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'An unexpected error occurred. Please try again.'
  });
});

app.listen(PORT, () => {
  console.log(`📖 BookSnap server running on port ${PORT}`);
});
