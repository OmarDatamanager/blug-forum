const pool = require('../config/database');

const Thread = {
  async create(threadData) {
    const { title, forum_id, created_by, is_public = true } = threadData;
    const query = `
      INSERT INTO threads (title, forum_id, created_by, is_public) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const values = [title, forum_id, created_by, is_public];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByForum(forum_id) {
    const query = `
      SELECT t.*, u.username as creator_name 
      FROM threads t 
      LEFT JOIN users u ON t.created_by = u.id 
      WHERE t.forum_id = $1
    `;
    const result = await pool.query(query, [forum_id]);
    return result.rows;
  },

  async findById(id) {
    const query = `
      SELECT t.*, u.username as creator_name 
      FROM threads t 
      LEFT JOIN users u ON t.created_by = u.id 
      WHERE t.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async updateThreadOwner(thread_id, new_owner_id) {
    const query = 'UPDATE threads SET created_by = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [new_owner_id, thread_id]);
    return result.rows[0];
  },

  async updateThreadPrivacy(thread_id, is_public) {
    const query = 'UPDATE threads SET is_public = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [is_public, thread_id]);
    return result.rows[0];
  }
};

module.exports = Thread;