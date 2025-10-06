const express = require('express');
const moderatorController = require('../controllers/moderatorController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Manage moderators for threads
router.post('/:thread/moderators', authMiddleware.verifyToken, moderatorController.addModerator);
router.delete('/:thread/moderators', authMiddleware.verifyToken, moderatorController.removeModerator);

// Manage thread members
router.post('/:thread/invite', authMiddleware.verifyToken, moderatorController.inviteToThread);
router.delete('/:thread/members', authMiddleware.verifyToken, moderatorController.removeThreadMember);

module.exports = router;