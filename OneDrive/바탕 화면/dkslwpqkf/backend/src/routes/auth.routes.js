import express from 'express';
import { body, validationResult } from 'express-validator';
import UserService from '../services/user.service.js';
import { generateAccessToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Register a new user (only for initial setup, in production this would be protected)
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('personalKey').isLength({ min: 8, max: 8 }).withMessage('Personal key must be 8 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, personalKey } = req.body;
      
      // Check if user with this personal key already exists
      const existingUser = await UserService.getUserByPersonalKey(personalKey);
      if (existingUser) {
        return res.status(400).json({ error: 'User with this personal key already exists' });
      }
      
      // Create new user
      const user = await UserService.createUser(name, personalKey);
      
      // Generate JWT token
      const token = generateAccessToken(user);
      
      res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          personalKey: user.personal_key,
          gold: user.gold,
          money: user.money
        },
        token
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// Login with personal key
router.post(
  '/login',
  [
    body('personalKey').isLength({ min: 8, max: 8 }).withMessage('Invalid personal key')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { personalKey } = req.body;
      
      // Find user by personal key
      const user = await UserService.getUserByPersonalKey(personalKey);
      if (!user) {
        return res.status(401).json({ error: 'Invalid personal key' });
      }
      
      // Update last login
      await UserService.updateLastLogin(user.id);
      
      // Generate JWT token
      const token = generateAccessToken(user);
      
      res.json({
        user: {
          id: user.id,
          name: user.name,
          personalKey: user.personal_key,
          gold: user.gold,
          money: user.money,
          loginStreak: user.login_streak
        },
        token
      });
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    // The user ID is set by the auth middleware
    const userId = req.user.id;
    
    // Get user with their current sword
    const user = await UserService.getUserWithSword(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get battle stats
    const battleStats = await UserService.getUserBattleStats(userId);
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        gold: user.gold,
        money: user.money,
        loginStreak: user.login_streak,
        lastLogin: user.last_login,
        ...battleStats
      },
      sword: user.sword_id ? {
        id: user.sword_id,
        name: user.sword_name,
        level: user.sword_level,
        power: user.sword_power
      } : null
    });
    
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
