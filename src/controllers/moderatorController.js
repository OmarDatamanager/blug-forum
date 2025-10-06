const Moderator = require('../models/moderatorModel');
const Thread = require('../models/threadModel');

const moderatorController = {
  async addModerator(req, res) {
    try {
      const { thread } = req.params;
      const { user_id } = req.body;

      // Check if the current user is the thread owner
      const threadInfo = await Thread.findById(thread);
      if (threadInfo.created_by !== req.user.userId) {
        return res.status(403).json({ error: 'Only thread owner can add moderators' });
      }

      await Moderator.addModerator(thread, user_id);
      res.json({ message: 'Moderator added successfully' });
    } catch (error) {
      console.error('Error adding moderator:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async removeModerator(req, res) {
    try {
      const { thread } = req.params;
      const { user_id } = req.body;

      // Check if the current user is the thread owner
      const threadInfo = await Thread.findById(thread);
      if (threadInfo.created_by !== req.user.userId) {
        return res.status(403).json({ error: 'Only thread owner can remove moderators' });
      }

      await Moderator.removeModerator(thread, user_id);
      res.json({ message: 'Moderator removed successfully' });
    } catch (error) {
      console.error('Error removing moderator:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async inviteToThread(req, res) {
    try {
      const { thread } = req.params;
      const { user_id } = req.body;

      // Check if the current user is the thread owner or a moderator
      const threadInfo = await Thread.findById(thread);
      const isModerator = await Moderator.isModerator(thread, req.user.userId);

      if (threadInfo.created_by !== req.user.userId && !isModerator) {
        return res.status(403).json({ error: 'Only thread owner or moderators can invite users' });
      }

      await Moderator.addThreadMember(thread, user_id);
      res.json({ message: 'User invited to thread successfully' });
    } catch (error) {
      console.error('Error inviting user:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async removeThreadMember(req, res) {
    try {
      const { thread } = req.params;
      const { user_id } = req.body;

      // Check if the current user is the thread owner or a moderator
      const threadInfo = await Thread.findById(thread);
      const isModerator = await Moderator.isModerator(thread, req.user.userId);

      if (threadInfo.created_by !== req.user.userId && !isModerator) {
        return res.status(403).json({ error: 'Only thread owner or moderators can remove users' });
      }

      await Moderator.removeThreadMember(thread, user_id);
      res.json({ message: 'User removed from thread successfully' });
    } catch (error) {
      console.error('Error removing user:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = moderatorController;