const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Blug Forum API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;