const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/forums', require('./routes/forumRoutes'));
app.use('/api/threads', require('./routes/threadRoutes'));
app.use('/api', require('./routes/messageRoutes'));
app.use('/api/threads', require('./routes/moderatorRoutes'));



// Test route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Blug Forum API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;