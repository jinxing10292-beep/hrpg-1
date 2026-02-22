import http from 'http';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const server = http.createServer(async (req, res) => {
  if (req.url === '/health') {
    try {
      // Check database connection
      await pool.query('SELECT 1');
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    } catch (error) {
      console.error('Health check failed:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', error: error.message }));
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

const PORT = process.env.HEALTH_CHECK_PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Health check server running on port ${PORT}`);
});
