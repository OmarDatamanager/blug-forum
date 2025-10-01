const express = require('express');
const User = require('../models/userModel');
const authMiddleware = require('../middleware/auth');
const pool = require('../config/database');

const router = express.Router();

// Get all users (protected route)
router.get('/', authMiddleware.verifyToken, async (req, res) => {
  try {
    const query = 'SELECT id, username, email, role, created_at FROM users';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', authMiddleware.verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;