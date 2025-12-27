import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Test the database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    client.release();
    return true;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }
};

// Run database migrations
const runMigrations = async () => {
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execPromise = promisify(exec);
  
  try {
    const { stdout, stderr } = await execPromise('npx node-pg-migrate up');
    console.log('Migrations output:', stdout);
    if (stderr) console.error('Migrations error:', stderr);
    return true;
  } catch (error) {
    console.error('Error running migrations:', error);
    return false;
  }
};

export { pool, testConnection, runMigrations };

export default {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
