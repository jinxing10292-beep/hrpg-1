import db from '../config/db.js';

class DatabaseService {
  async query(text, params) {
    try {
      const result = await db.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async getClient() {
    try {
      const client = await db.getClient();
      return client;
    } catch (error) {
      console.error('Error getting database client:', error);
      throw error;
    }
  }
}

export default new DatabaseService();
