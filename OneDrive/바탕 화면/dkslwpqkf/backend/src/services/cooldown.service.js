import db from './db.service.js';

const BATTLE_COOLDOWN_MS = 30 * 1000; // 30 seconds cooldown

const CooldownService = {
  // Check if user is in cooldown
  async isInCooldown(userId, action = 'battle') {
    const query = `
      SELECT last_used FROM user_cooldowns 
      WHERE user_id = $1 AND action = $2
    `;
    
    const result = await db.query(query, [userId, action]);
    
    if (result.rows.length === 0) {
      return false;
    }
    
    const lastUsed = new Date(result.rows[0].last_used);
    const now = new Date();
    const timeDiff = now - lastUsed;
    
    return timeDiff < BATTLE_COOLDOWN_MS;
  },
  
  // Set cooldown for a user action
  async setCooldown(userId, action = 'battle') {
    const query = `
      INSERT INTO user_cooldowns (user_id, action, last_used)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id, action) 
      DO UPDATE SET last_used = EXCLUDED.last_used
    `;
    
    await db.query(query, [userId, action]);
  },
  
  // Get remaining cooldown time in seconds
  async getRemainingCooldown(userId, action = 'battle') {
    const query = `
      SELECT last_used FROM user_cooldowns 
      WHERE user_id = $1 AND action = $2
    `;
    
    const result = await db.query(query, [userId, action]);
    
    if (result.rows.length === 0) {
      return 0;
    }
    
    const lastUsed = new Date(result.rows[0].last_updated);
    const now = new Date();
    const timeDiff = now - lastUsed;
    const remainingMs = BATTLE_COOLDOWN_MS - timeDiff;
    
    return Math.max(0, Math.ceil(remainingMs / 1000)); // Return in seconds
  }
};

export default CooldownService;
