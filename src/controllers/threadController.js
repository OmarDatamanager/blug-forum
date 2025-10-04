const Thread = require('../models/threadModel');

const threadController = {
  async createThread(req, res) {
    try {
      const { title, is_public = true } = req.body;
      const forum_id = req.params.forum;

      const threadData = {
        title,
        forum_id,
        created_by: req.user.userId,
        is_public
      };

      const thread = await Thread.create(threadData);
      res.status(201).json({
        message: 'Thread created successfully',
        thread
      });
    } catch (error) {
      console.error('Error creating thread:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getThreadsByForum(req, res) {
    try {
      const threads = await Thread.findByForum(req.params.forum);
      res.json(threads);
    } catch (error) {
      console.error('Error getting threads:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getThreadById(req, res) {
    try {
      const thread = await Thread.findById(req.params.thread);
      if (!thread) {
        return res.status(404).json({ error: 'Thread not found' });
      }
      res.json(thread);
    } catch (error) {
      console.error('Error getting thread:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async updateThreadOwner(req, res) {
    try {
      const { changeCreator } = req.body;

      // Check if the requester is the current owner
      const thread = await Thread.findById(req.params.thread);
      if (thread.created_by !== req.user.userId) {
        return res.status(403).json({ error: 'Only thread owner can transfer ownership' });
      }

      const updatedThread = await Thread.updateThreadOwner(req.params.thread, changeCreator);
      res.json({
        message: 'Thread ownership transferred successfully',
        thread: updatedThread
      });
    } catch (error) {
      console.error('Error updating thread owner:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = threadController;