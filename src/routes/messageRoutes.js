const express = require('express');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/:forum/:thread/messages', messageController.getMessagesByThread);
router.get('/:forum/:thread/:id', messageController.getMessageById);

// Protected routes
router.post('/:forum/:thread', authMiddleware.verifyToken, messageController.createMessage);
router.patch('/:forum/:thread/:id', authMiddleware.verifyToken, messageController.updateMessage);
router.delete('/:forum/:thread/:id', authMiddleware.verifyToken, messageController.deleteMessage);

module.exports = router;