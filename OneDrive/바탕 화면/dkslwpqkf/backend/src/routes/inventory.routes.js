import express from 'express';
import { body, param, validationResult } from 'express-validator';
import SwordService from '../services/sword.service.js';
import UserService from '../services/user.service.js';

const router = express.Router();

// Get current sword
router.get('/sword', async (req, res) => {
  try {
    const userId = req.user.id;
    const sword = await SwordService.getUserSword(userId);
    
    if (!sword) {
      // Create a new level 0 sword if user doesn't have one
      const newSword = await SwordService.createSword(userId, 0);
      return res.json({
        sword: {
          ...newSword,
          description: SwordService.getSwordDescription(newSword.level)
        },
        isNew: true
      });
    }
    
    res.json({
      sword: {
        ...sword,
        description: SwordService.getSwordDescription(sword.level)
      }
    });
    
  } catch (error) {
    console.error('Get sword error:', error);
    res.status(500).json({ error: 'Failed to get sword' });
  }
});

// Sell current sword
router.post('/sell', async (req, res) => {
  try {
    const userId = req.user.id;
    const sword = await SwordService.getUserSword(userId);
    
    if (!sword) {
      return res.status(404).json({ error: 'No sword to sell' });
    }
    
    // Can't sell your only sword if it's level 0
    if (sword.level === 0) {
      return res.status(400).json({ 
        error: 'Cannot sell a level 0 sword',
        message: 'You need at least one sword to play the game.'
      });
    }
    
    // Sell the sword
    const result = await SwordService.sellSword(sword.id, userId);
    
    res.json({
      success: true,
      message: result.message,
      goldReceived: result.goldReceived,
      newSword: result.newSword ? {
        ...result.newSword,
        description: SwordService.getSwordDescription(0)
      } : null
    });
    
  } catch (error) {
    console.error('Sell sword error:', error);
    res.status(500).json({ 
      error: 'Failed to sell sword',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all user's swords (for future inventory expansion)
router.get('/swords', async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT * FROM swords 
      WHERE user_id = $1 
      ORDER BY level DESC, created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    
    const swords = result.rows.map(sword => ({
      ...sword,
      description: SwordService.getSwordDescription(sword.level),
      sellValue: SwordService.calculateSellValue(sword)
    }));
    
    res.json({ swords });
    
  } catch (error) {
    console.error('Get swords error:', error);
    res.status(500).json({ error: 'Failed to get swords' });
  }
});

// Equip a specific sword (for future inventory expansion)
router.post(
  '/equip/:swordId',
  [
    param('swordId').isUUID().withMessage('Invalid sword ID')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { swordId } = req.params;
      const userId = req.user.id;
      
      // Verify the sword belongs to the user
      const swordQuery = 'SELECT * FROM swords WHERE id = $1 AND user_id = $2';
      const swordResult = await db.query(swordQuery, [swordId, userId]);
      
      if (swordResult.rows.length === 0) {
        return res.status(404).json({ error: 'Sword not found' });
      }
      
      // In a real implementation, you would update a 'current_sword_id' field in the users table
      // For now, we'll just return the sword
      
      res.json({
        success: true,
        message: 'Sword equipped',
        sword: {
          ...swordResult.rows[0],
          description: SwordService.getSwordDescription(swordResult.rows[0].level)
        }
      });
      
    } catch (error) {
      console.error('Equip sword error:', error);
      res.status(500).json({ error: 'Failed to equip sword' });
    }
  }
);

export default router;
