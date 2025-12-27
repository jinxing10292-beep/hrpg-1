import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sword_game',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool
};
