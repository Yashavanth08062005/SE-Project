const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

const initDb = async () => {
    try {
        console.log("🔗 Connected to DB:", process.env.DB_NAME);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        skill VARCHAR(100)
      );
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS peers (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100),
        company VARCHAR(100)
      );
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS peer_skills (
        id SERIAL PRIMARY KEY,
        peer_id INT REFERENCES peers(id) ON DELETE CASCADE,
        skill VARCHAR(100)
      );
    `);

        console.log("✅ Database tables ready");
    } catch (err) {
        console.error("❌ DB Init Error:", err.message);
    }
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    initDb,
};
