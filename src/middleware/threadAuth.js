const Moderator = require('../models/moderatorModel');
const Thread = require('../models/threadModel');

const threadAuth = {
  isThreadOwner: async (req, res, next) => {
    try {
      const thread = await Thread.findById(req.params.thread);
      if (!thread) {
        return res.status(404).json({ error: 'Thread not found' });
      }

      if (thread.created_by !== req.user.userId) {
        return res.status(403).json({ error: 'Access denied. Thread owner only.' });
      }

      req.thread = thread;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  isThreadOwnerOrModerator: async (req, res, next) => {
    try {
      const thread = await Thread.findById(req.params.thread);
      if (!thread) {
        return res.status(404).json({ error: 'Thread not found' });
      }

      const isModerator = await Moderator.isModerator(req.params.thread, req.user.userId);

      if (thread.created_by !== req.user.userId && !isModerator) {
        return res.status(403).json({ error: 'Access denied. Thread owner or moderator only.' });
      }

      req.thread = thread;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  canAccessThread: async (req, res, next) => {
    try {
      const thread = await Thread.findById(req.params.thread);
      if (!thread) {
        return res.status(404).json({ error: 'Thread not found' });
      }

      // If the thread is public, allow access
      if (thread.is_public) {
        req.thread = thread;
        return next();
      }

      // If the thread is private, check membership or ownership/moderation
      const isMember = await Moderator.isThreadMember(req.params.thread, req.user.userId);
      const isOwnerOrModerator = thread.created_by === req.user.userId ||
        await Moderator.isModerator(req.params.thread, req.user.userId);

      if (!isMember && !isOwnerOrModerator) {
        return res.status(403).json({ error: 'Access denied. Private thread.' });
      }

      req.thread = thread;
      next();
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = threadAuth;