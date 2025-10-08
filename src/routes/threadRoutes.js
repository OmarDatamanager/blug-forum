const express = require('express');
const threadController = require('../controllers/threadController');
const authMiddleware = require('../middleware/auth');
const { validateThreadCreation } = require('../middleware/validation');


const router = express.Router();

// Public routes
router.get('/:forum', threadController.getThreadsByForum);
router.get('/:forum/:thread', threadController.getThreadById);

// Protected routes
router.post('/:forum', authMiddleware.verifyToken, validateThreadCreation, threadController.createThread);
router.patch('/:forum/:thread', authMiddleware.verifyToken, threadController.updateThreadOwner);

module.exports = router;