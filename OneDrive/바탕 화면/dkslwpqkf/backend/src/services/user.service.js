import db from './db.service.js';
import { ValidationError, DatabaseError, NotFoundError } from '../utils/errors.js';

// Constants
const MIN_USERNAME_LENGTH = 2;
const MAX_USERNAME_LENGTH = 20;
const MIN_PERSONAL_KEY_LENGTH = 8;
const MAX_PERSONAL_KEY_LENGTH = 20;

const UserService = {
  async createUser(name, personalKey) {
    // Input validation
    if (!name || name.length < MIN_USERNAME_LENGTH || name.length > MAX_USERNAME_LENGTH) {
      throw new ValidationError(`Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters`);
    }
    
    if (!personalKey || personalKey.length < MIN_PERSONAL_KEY_LENGTH || personalKey.length > MAX_PERSONAL_KEY_LENGTH) {
      throw new ValidationError(`Personal key must be between ${MIN_PERSONAL_KEY_LENGTH} and ${MAX_PERSONAL_KEY_LENGTH} characters`);
    }

    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Check if username or personal key already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE name = $1 OR personal_key = $2',
        [name, personalKey]
      );
      
      if (existingUser.rows.length > 0) {
        throw new ValidationError('Username or personal key already exists');
      }
      
      const query = `
        INSERT INTO users (name, personal_key, created_at, last_login)
        VALUES ($1, $2, NOW(), NOW())
        RETURNING id, name, created_at, last_login, gold, money, battle_count, login_streak
      `;
      
      const result = await client.query(query, [name, personalKey]);
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      if (error instanceof ValidationError) throw error;
      throw new DatabaseError('Failed to create user', { cause: error });
    } finally {
      client.release();
    }
  },

  async getUserById(id) {
    if (!id) throw new ValidationError('User ID is required');
    
    try {
      const query = `
        SELECT 
          id, name, gold, money, battle_count, login_streak, 
          created_at, last_login, is_banned
        FROM users 
        WHERE id = $1
      `;
      const result = await db.query(query, [id]);
      
      if (!result.rows[0]) {
        throw new NotFoundError('User not found');
      }
      
      return result.rows[0];
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to fetch user', { cause: error });
    }
  },

  async getUserByPersonalKey(personalKey) {
    if (!personalKey) throw new ValidationError('Personal key is required');
    
    try {
      const query = `
        SELECT 
          id, name, gold, money, battle_count, login_streak, 
          created_at, last_login, is_banned
        FROM users 
        WHERE personal_key = $1
      `;
      const result = await db.query(query, [personalKey]);
      
      if (!result.rows[0]) {
        throw new NotFoundError('User not found with the provided personal key');
      }
      
      return result.rows[0];
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to fetch user by personal key', { cause: error });
    }
  },

  async updateUserGold(userId, amount) {
    if (!userId) throw new ValidationError('User ID is required');
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new ValidationError('Amount must be a valid number');
    }
    
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Check if user exists and has enough gold if deducting
      if (amount < 0) {
        const current = await client.query(
          'SELECT gold FROM users WHERE id = $1 FOR UPDATE',
          [userId]
        );
        
        if (!current.rows[0]) {
          throw new NotFoundError('User not found');
        }
        
        if (current.rows[0].gold + amount < 0) {
          throw new ValidationError('Insufficient gold');
        }
      }
      
      const query = `
        UPDATE users 
        SET gold = gold + $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING id, name, gold, money
      `;
      
      const result = await client.query(query, [amount, userId]);
      
      if (result.rows.length === 0) {
        throw new NotFoundError('User not found');
      }
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update user gold', { cause: error });
    } finally {
      client.release();
    }
  },

  async updateLastLogin(userId) {
    if (!userId) throw new ValidationError('User ID is required');
    
    try {
      const query = `
        WITH streak_update AS (
          SELECT 
            id,
            CASE 
              WHEN last_login < CURRENT_DATE - INTERVAL '1 day' 
              THEN 1
              ELSE login_streak + 1
            END AS new_streak
          FROM users
          WHERE id = $1
          FOR UPDATE
        )
        UPDATE users u
        SET 
          last_login = NOW(),
          login_streak = su.new_streak,
          updated_at = NOW()
        FROM streak_update su
        WHERE u.id = su.id
        RETURNING u.*
      `;
      
      const result = await db.query(query, [userId]);
      
      if (result.rows.length === 0) {
        throw new NotFoundError('User not found');
      }
      
      return result.rows[0];
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to update last login', { cause: error });
    }
  },

  async getUserWithSword(userId) {
    if (!userId) throw new ValidationError('User ID is required');
    
    try {
      const query = `
        SELECT 
          u.id, u.name, u.gold, u.money, u.battle_count, u.login_streak,
          u.created_at, u.last_login, u.is_banned,
          s.id as sword_id, 
          s.name as sword_name, 
          s.level as sword_level, 
          s.base_power, 
          s.current_power, 
          s.is_hidden, 
          s.created_at as sword_created_at,
          s.enhanced_at as sword_enhanced_at,
          (SELECT COUNT(*) FROM battles b WHERE b.winner_id = u.id) as wins,
          (SELECT COUNT(*) FROM battles b 
           WHERE (b.player1_id = u.id OR b.player2_id = u.id) 
           AND b.winner_id IS NOT NULL) as total_battles,
          (SELECT COUNT(*) FROM achievements a 
           WHERE a.user_id = u.id AND a.unlocked = true) as achievement_count
        FROM users u
        LEFT JOIN LATERAL (
          SELECT * FROM swords 
          WHERE user_id = u.id 
          ORDER BY level DESC, created_at DESC 
          LIMIT 1
        ) s ON true
        WHERE u.id = $1
      `;
      
      const result = await db.query(query, [userId]);
      
      if (!result.rows[0]) {
        throw new NotFoundError('User not found');
      }
      
      return result.rows[0];
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to fetch user with sword', { cause: error });
    }
  },

  async getLeaderboard(limit = 10, offset = 0, sortBy = 'power') {
    if (limit < 1 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }
    
    if (offset < 0) {
      throw new ValidationError('Offset must be a positive number');
    }
    
    const validSortOptions = ['power', 'gold', 'wins', 'battles'];
    if (!validSortOptions.includes(sortBy)) {
      throw new ValidationError('Invalid sort option');
    }
    
    try {
      // Subquery to get user stats
      const userStatsQuery = `
        WITH user_stats AS (
          SELECT 
            u.id,
            u.name,
            u.gold,
            u.money,
            u.battle_count,
            COALESCE(s.level, 0) as sword_level,
            s.name as sword_name,
            s.current_power,
            (SELECT COUNT(*) FROM battles b WHERE b.winner_id = u.id) as wins,
            (SELECT COUNT(*) FROM battles b 
             WHERE b.player1_id = u.id OR b.player2_id = u.id) as total_battles,
            (SELECT COUNT(*) FROM achievements a 
             WHERE a.user_id = u.id AND a.unlocked = true) as achievement_count
          FROM users u
          LEFT JOIN LATERAL (
            SELECT * FROM swords 
            WHERE user_id = u.id 
            ORDER BY level DESC, created_at DESC 
            LIMIT 1
          ) s ON true
          WHERE NOT u.is_banned
        )
        SELECT 
          us.*,
          ROW_NUMBER() OVER (
            ORDER BY 
              CASE WHEN $3 = 'gold' THEN us.gold
                   WHEN $3 = 'wins' THEN us.wins
                   WHEN $3 = 'battles' THEN us.total_battles
                   ELSE us.sword_level * 1000 + us.current_power
              END DESC
          ) as rank
        FROM user_stats us
        ORDER BY 
          CASE WHEN $3 = 'gold' THEN us.gold
               WHEN $3 = 'wins' THEN us.wins
               WHEN $3 = 'battles' THEN us.total_battles
               ELSE us.sword_level * 1000 + us.current_power
          END DESC
        LIMIT $1 OFFSET $2
      `;
      
      const result = await db.query(userStatsQuery, [limit, offset, sortBy]);
      
      // Get total count for pagination
      const countResult = await db.query('SELECT COUNT(*) as total FROM users WHERE NOT is_banned');
      const total = parseInt(countResult.rows[0].total, 10);
      
      return {
        items: result.rows,
        pagination: {
          total,
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
          hasMore: offset + result.rows.length < total
        }
      };
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new DatabaseError('Failed to fetch leaderboard', { cause: error });
    }
  },
  
  async getUserRank(userId) {
    const query = `
      SELECT rank FROM (
        SELECT 
          u.id,
          ROW_NUMBER() OVER (ORDER BY COALESCE(s.level, 0) DESC, u.gold DESC) as rank
        FROM users u
        LEFT JOIN (
          SELECT DISTINCT ON (user_id) *
          FROM swords
          ORDER BY user_id, level DESC, created_at DESC
        ) s ON u.id = s.user_id
      ) ranked
      WHERE id = $1
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0]?.rank || 0;
  },
  
  async getBattleStatistics(limit = 10) {
    // Top winners
    const topWinnersQuery = `
      SELECT u.id, u.name, COUNT(b.id) as wins
      FROM users u
      LEFT JOIN battles b ON u.id = b.winner_id
      GROUP BY u.id, u.name
      ORDER BY wins DESC
      LIMIT $1
    `;
    
    // Most active players
    const mostActiveQuery = `
      SELECT u.id, u.name, COUNT(b.id) as battle_count
      FROM users u
      LEFT JOIN (
        SELECT player1_id as user_id, id FROM battles
        UNION ALL
        SELECT player2_id as user_id, id FROM battles
      ) b ON u.id = b.user_id
      GROUP BY u.id, u.name
      ORDER BY battle_count DESC
      LIMIT $1
    `;
    
    // Most powerful swords
    const topSwordsQuery = `
      SELECT u.id as user_id, u.name as user_name, 
             s.name as sword_name, s.level, s.current_power
      FROM swords s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.current_power DESC, s.level DESC
      LIMIT $1
    `;
    
    const [topWinners, mostActive, topSwords] = await Promise.all([
      db.query(topWinnersQuery, [limit]),
      db.query(mostActiveQuery, [limit]),
      db.query(topSwordsQuery, [limit])
    ]);
    
    return {
      topWinners: topWinners.rows,
      mostActive: mostActive.rows,
      topSwords: topSwords.rows
    };
  }
};

export default UserService;
