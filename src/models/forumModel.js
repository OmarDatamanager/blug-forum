const pool = require('../config/database');

const Forum = {
  async create(forumData) {
    const { name, description, slug, created_by } = forumData;
    const query = `
      INSERT INTO forums (name, description, slug, created_by) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const values = [name, description, slug, created_by];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findAll() {
    const query = `
      SELECT f.*, u.username as creator_name 
      FROM forums f 
      LEFT JOIN users u ON f.created_by = u.id
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM forums WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findByName(name) {
    const query = 'SELECT * FROM forums WHERE name = $1';
    const result = await pool.query(query, [name]);
    return result.rows[0];
  }
};

module.exports = Forum;