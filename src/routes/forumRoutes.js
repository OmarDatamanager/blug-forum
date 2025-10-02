const express = require('express');
const forumController = require('../controllers/forumController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', forumController.getAllForums);
router.get('/by-id/:id', forumController.getForumById);

// Protected routes - require authentication
router.post('/', authMiddleware.verifyToken, forumController.createForum);

module.exports = router;