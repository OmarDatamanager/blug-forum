const Forum = require('../models/forumModel');

const forumController = {
  async createForum(req, res) {
    try {
      const { name, description } = req.body;
      const slug = name.toLowerCase().replace(/\s+/g, '-');

      const forumData = {
        name,
        description,
        slug,
        created_by: req.user.userId
      };

      const forum = await Forum.create(forumData);
      res.status(201).json({
        message: 'Forum created successfully',
        forum
      });
    } catch (error) {
      console.error('Error creating forum:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getAllForums(req, res) {
    try {
      const forums = await Forum.findAll();
      res.json(forums);
    } catch (error) {
      console.error('Error getting forums:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getForumById(req, res) {
    try {
      const forum = await Forum.findById(req.params.id);
      if (!forum) {
        return res.status(404).json({ error: 'Forum not found' });
      }
      res.json(forum);
    } catch (error) {
      console.error('Error getting forum:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = forumController;