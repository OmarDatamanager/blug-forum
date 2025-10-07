const pool = require('../config/database');

const Moderator = {
  async addModerator(thread_id, user_id) {
    const query = 'INSERT INTO thread_moderators (thread_id, user_id) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [thread_id, user_id]);
    return result.rows[0];
  },

  async removeModerator(thread_id, user_id) {
    const query = 'DELETE FROM thread_moderators WHERE thread_id = $1 AND user_id = $2';
    await pool.query(query, [thread_id, user_id]);
  },

  async isModerator(thread_id, user_id) {
    const query = 'SELECT * FROM thread_moderators WHERE thread_id = $1 AND user_id = $2';
    const result = await pool.query(query, [thread_id, user_id]);
    return result.rows.length > 0;
  },

  async addThreadMember(thread_id, user_id) {
    const query = 'INSERT INTO thread_members (thread_id, user_id) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [thread_id, user_id]);
    return result.rows[0];
  },

  async removeThreadMember(thread_id, user_id) {
    const query = 'DELETE FROM thread_members WHERE thread_id = $1 AND user_id = $2';
    await pool.query(query, [thread_id, user_id]);
  },

  async isThreadMember(thread_id, user_id) {
    const query = 'SELECT * FROM thread_members WHERE thread_id = $1 AND user_id = $2';
    const result = await pool.query(query, [thread_id, user_id]);
    return result.rows.length > 0;
  }
};

module.exports = Moderator;