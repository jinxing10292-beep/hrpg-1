import express from 'express';
import { query, param, validationResult } from 'express-validator';
import UserService from '../services/user.service.js';

const router = express.Router();

// Get top players with pagination
router.get(
  '/players',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const limit = parseInt(req.query.limit) || 20;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      
      const leaderboard = await UserService.getLeaderboard(limit, offset);
      
      // Get total player count
      const totalPlayers = (await UserService.db.query('SELECT COUNT(*) FROM users')).rows[0].count;
      const totalPages = Math.ceil(totalPlayers / limit);
      
      res.json({
        data: leaderboard,
        pagination: {
          total: parseInt(totalPlayers),
          page,
          limit,
          totalPages
        }
      });
      
    } catch (error) {
      console.error('Leaderboard error:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  }
);

// Get user rank
router.get(
  '/rank/:userId',
  [
    param('userId').isUUID().withMessage('Invalid user ID')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { userId } = req.params;
      const rank = await UserService.getUserRank(userId);
      
      res.json({ rank });
      
    } catch (error) {
      console.error('Rank error:', error);
      res.status(500).json({ error: 'Failed to fetch user rank' });
    }
  }
);

// Get battle statistics
router.get(
  '/stats',
  [
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const limit = parseInt(req.query.limit) || 10;
      
      // Get top winners
      const topWinnersQuery = `
        SELECT u.id, u.name, COUNT(b.id) as wins
        FROM users u
        LEFT JOIN battles b ON u.id = b.winner_id
        GROUP BY u.id, u.name
        ORDER BY wins DESC
        LIMIT $1
      `;
      
      // Get most active players
      const mostActiveQuery = `
        SELECT u.id, u.name, COUNT(b.id) as battle_count
        FROM users u
        JOIN battles b ON u.id = b.player1_id OR u.id = b.player2_id
        GROUP BY u.id, u.name
        ORDER BY battle_count DESC
        LIMIT $1
      `;
      
      // Get top swords
      const topSwordsQuery = `
        SELECT s.id, s.name, s.level, s.current_power, u.id as user_id, u.name as user_name
        FROM swords s
        JOIN users u ON s.user_id = u.id
        ORDER BY s.level DESC, s.current_power DESC
        LIMIT $1
      `;
      
      const [topWinners, mostActive, topSwords] = await Promise.all([
        UserService.db.query(topWinnersQuery, [limit]),
        UserService.db.query(mostActiveQuery, [limit]),
        UserService.db.query(topSwordsQuery, [limit])
      ]);
      
      res.json({
        topWinners: topWinners.rows,
        mostActive: mostActive.rows,
        topSwords: topSwords.rows
      });
      
    } catch (error) {
      console.error('Battle stats error:', error);
      res.status(500).json({ error: 'Failed to fetch battle statistics' });
    }
  }
);

// Get recent global battles
router.get(
  '/recent-battles',
  [
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const limit = parseInt(req.query.limit) || 10;
      const battleQuery = `
        SELECT 
          b.id,
          b.created_at as timestamp,
          p1.id as player1_id,
          p1.name as player1_name,
          p2.id as player2_id,
          p2.name as player2_name,
          w.id as winner_id,
          w.name as winner_name,
          s1.name as player1_sword_name,
          s2.name as player2_sword_name
        FROM battles b
        JOIN users p1 ON b.player1_id = p1.id
        JOIN users p2 ON b.player2_id = p2.id
        LEFT JOIN users w ON b.winner_id = w.id
        JOIN swords s1 ON b.player1_sword_id = s1.id
        JOIN swords s2 ON b.player2_sword_id = s2.id
        ORDER BY b.created_at DESC
        LIMIT $1
      `;
      
      const result = await UserService.db.query(battleQuery, [limit]);
      
      const battles = result.rows.map(battle => ({
        id: battle.id,
        timestamp: battle.timestamp,
        players: [
          {
            id: battle.player1_id,
            name: battle.player1_name,
            sword: battle.player1_sword_name,
            isWinner: battle.winner_id === battle.player1_id,
            isDraw: !battle.winner_id
          },
          {
            id: battle.player2_id,
            name: battle.player2_name,
            sword: battle.player2_sword_name,
            isWinner: battle.winner_id === battle.player2_id,
            isDraw: !battle.winner_id
          }
        ]
      }));
      
      res.json({ battles });
      
    } catch (error) {
      console.error('Recent battles error:', error);
      res.status(500).json({ error: 'Failed to fetch recent battles' });
    }
  }
);

// Get user battle history
router.get(
  '/user/:userId/battles',
  [
    param('userId').isUUID().withMessage('Invalid user ID'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { userId } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      
      const battleQuery = `
        SELECT 
          b.id,
          b.created_at as timestamp,
          p1.id as player1_id,
          p1.name as player1_name,
          p2.id as player2_id,
          p2.name as player2_name,
          w.id as winner_id,
          w.name as winner_name,
          s1.name as player1_sword_name,
          s2.name as player2_sword_name
        FROM battles b
        JOIN users p1 ON b.player1_id = p1.id
        JOIN users p2 ON b.player2_id = p2.id
        LEFT JOIN users w ON b.winner_id = w.id
        JOIN swords s1 ON b.player1_sword_id = s1.id
        JOIN swords s2 ON b.player2_sword_id = s2.id
        WHERE b.player1_id = $1 OR b.player2_id = $1
        ORDER BY b.created_at DESC
        LIMIT $2
      `;
      
      const result = await UserService.db.query(battleQuery, [userId, limit]);
      
      const battles = result.rows.map(battle => ({
        id: battle.id,
        timestamp: battle.timestamp,
        opponent: battle.player1_id === userId ? {
          id: battle.player2_id,
          name: battle.player2_name,
          sword: battle.player2_sword_name
        } : {
          id: battle.player1_id,
          name: battle.player1_name,
          sword: battle.player1_sword_name
        },
        result: battle.winner_id ? 
          (battle.winner_id === userId ? 'victory' : 'defeat') : 'draw',
        yourSword: battle.player1_id === userId ? 
          battle.player1_sword_name : battle.player2_sword_name
      }));
      
      res.json({ battles });
      
    } catch (error) {
      console.error('User battles error:', error);
      res.status(500).json({ error: 'Failed to fetch user battle history' });
    }
  }
);

export default router;
