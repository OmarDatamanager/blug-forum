const Message = require('../models/messageModel');

const messageController = {
  async createMessage(req, res) {
    try {
      const { text } = req.body;
      const { forum, thread } = req.params;

      const messageData = {
        content: text,
        thread_id: thread,
        user_id: req.user.userId
      };

      const message = await Message.create(messageData);
      res.status(201).json({
        message: 'Message created successfully',
        message: message
      });
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getMessagesByThread(req, res) {
    try {
      const messages = await Message.findByThread(req.params.thread);
      res.json(messages);
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getMessageById(req, res) {
    try {
      const message = await Message.findById(req.params.id);
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.json(message);
    } catch (error) {
      console.error('Error getting message:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async updateMessage(req, res) {
    try {
      const { text } = req.body;
      const messageId = req.params.id;

      // check if the user is the owner of the message
      const existingMessage = await Message.findById(messageId);
      if (!existingMessage) {
        return res.status(404).json({ error: 'Message not found' });
      }

      if (existingMessage.user_id !== req.user.userId) {
        return res.status(403).json({ error: 'You can only edit your own messages' });
      }

      const updatedMessage = await Message.update(messageId, text);
      res.json({
        message: 'Message updated successfully',
        message: updatedMessage
      });
    } catch (error) {
      console.error('Error updating message:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async deleteMessage(req, res) {
    try {
      const messageId = req.params.id;

      // check if the user is the owner of the message
      const existingMessage = await Message.findById(messageId);
      if (!existingMessage) {
        return res.status(404).json({ error: 'Message not found' });
      }

      if (existingMessage.user_id !== req.user.userId) {
        return res.status(403).json({ error: 'You can only delete your own messages' });
      }

      await Message.delete(messageId);
      res.json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = messageController;