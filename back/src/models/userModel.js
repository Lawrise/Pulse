const pool = require('../config/db');

class UserModel {
  static async create(username, email, hashedPassword) {
    const query = `
      INSERT INTO users (username, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING id, username, email
    `;
    const result = await pool.query(query, [username, email, hashedPassword]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async initialize() {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(createTableQuery);
  }
}

module.exports = UserModel;