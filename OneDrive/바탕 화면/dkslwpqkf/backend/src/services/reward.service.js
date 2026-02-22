import db from './db.service.js';
import UserService from './user.service.js';

const REWARD_STREAK_MULTIPLIER = 0.1; // 10% bonus for each consecutive day
const BASE_REWARD = 1000; // Base gold reward

const RewardService = {
  async claimDailyReward(userId) {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Get user with current login streak
      const userQuery = 'SELECT * FROM users WHERE id = $1 FOR UPDATE';
      const userResult = await client.query(userQuery, [userId]);
      const user = userResult.rows[0];
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const lastLogin = user.last_login ? new Date(user.last_login) : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let newStreak = user.login_streak || 0;
      let reward = BASE_REWARD;
      
      // Check if user already claimed reward today
      if (lastLogin && lastLogin >= today) {
        throw new Error('Daily reward already claimed');
      }
      
      // Check if it's a consecutive day
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLogin && lastLogin.getDate() === yesterday.getDate() && 
          lastLogin.getMonth() === yesterday.getMonth() && 
          lastLogin.getFullYear() === yesterday.getFullYear()) {
        // Consecutive day
        newStreak += 1;
      } else {
        // Reset streak if not consecutive
        newStreak = 1;
      }
      
      // Calculate reward with streak bonus
      const streakBonus = Math.floor(BASE_REWARD * (newStreak * REWARD_STREAK_MULTIPLIER));
      reward += streakBonus;
      
      // Update user with reward and new streak
      const updateQuery = `
        UPDATE users 
        SET gold = gold + $1,
            login_streak = $2,
            last_login = NOW()
        WHERE id = $3
        RETURNING *
      `;
      
      const updateResult = await client.query(updateQuery, [reward, newStreak, userId]);
      
      await client.query('COMMIT');
      
      return {
        success: true,
        reward: reward,
        streak: newStreak,
        streakBonus: streakBonus,
        user: updateResult.rows[0]
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};

export default RewardService;
