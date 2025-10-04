const pool = require('../config/database');

const Message = {
  async create(messageData) {
    const { content, thread_id, user_id } = messageData;
    const query = `
      INSERT INTO messages (content, thread_id, user_id) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const values = [content, thread_id, user_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByThread(thread_id) {
    const query = `
      SELECT m.*, u.username 
      FROM messages m 
      LEFT JOIN users u ON m.user_id = u.id 
      WHERE m.thread_id = $1
      ORDER BY m.created_at
    `;
    const result = await pool.query(query, [thread_id]);
    return result.rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM messages WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async update(id, content) {
    const query = 'UPDATE messages SET content = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [content, id]);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM messages WHERE id = $1';
    await pool.query(query, [id]);
  }
};

module.exports = Message;