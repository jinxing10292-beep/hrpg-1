import db from './db.service.js';
import { v4 as uuidv4 } from 'uuid';

// Sword name templates based on level
const SWORD_NAMES = [
  '흙먼지 검', // Dust Sword (Level 0)
  '녹슨 검',   // Rusty Sword (Level 1-3)
  '강철 검',   // Steel Sword (Level 4-6)
  '은빛 검',   // Silver Sword (Level 7-9)
  '황금 검',   // Golden Sword (Level 10-12)
  '다이아몬드 검', // Diamond Sword (Level 13-15)
  '전설의 검',  // Legendary Sword (Level 16-18)
  '신의 검'    // Divine Sword (Level 19-20)
];

// Sword descriptions based on level
const SWORD_DESCRIPTIONS = [
  '흙먼지가 약간 뭉쳐있는 것 같다.', // Level 0
  '녹이 슬어있지만 아직 쓸만해 보인다.', // Level 1-3
  '단단한 강철로 만들어진 평범한 검이다.', // Level 4-6
  '은은한 빛을 내는 고급스러운 검이다.', // Level 7-9
  '빛나는 황금으로 만들어진 고귀한 검이다.', // Level 10-12
  '희귀한 다이아몬드로 장식된 강력한 검이다.', // Level 13-15
  '전설에서만 전해지는 강력한 힘을 가진 검이다.', // Level 16-18
  '신의 축복을 받은 초월적인 힘의 검이다.' // Level 19-20
];

const SwordService = {
  // Create a new sword for a user
  async createSword(userId, level = 0) {
    const swordName = this.getSwordName(level);
    const basePower = this.calculateBasePower(level);
    const currentPower = this.calculateCurrentPower(basePower, level);
    const isHidden = Math.random() < 0.1; // 10% chance to be a hidden sword

    const query = `
      INSERT INTO swords (user_id, name, level, base_power, current_power, is_hidden, enhanced_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
    
    const result = await db.query(query, [
      userId,
      swordName,
      level,
      basePower,
      currentPower,
      isHidden
    ]);
    
    return result.rows[0];
  },

  // Get a user's current sword
  async getUserSword(userId) {
    const query = `
      SELECT * FROM swords 
      WHERE user_id = $1 
      ORDER BY level DESC, created_at DESC 
      LIMIT 1
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
  },

  // Enhance a sword
  async enhanceSword(swordId, userId) {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Get the sword with a lock to prevent concurrent updates
      const swordQuery = `
        SELECT * FROM swords 
        WHERE id = $1 AND user_id = $2 
        FOR UPDATE
      `;
      const swordResult = await client.query(swordQuery, [swordId, userId]);
      const sword = swordResult.rows[0];
      
      if (!sword) {
        throw new Error('Sword not found');
      }
      
      // Calculate enhancement cost and success rate
      const { cost, successRate } = this.calculateEnhancementCostAndRate(sword.level);
      
      // Check if user has enough gold
      const userQuery = 'SELECT gold FROM users WHERE id = $1 FOR UPDATE';
      const userResult = await client.query(userQuery, [userId]);
      const user = userResult.rows[0];
      
      if (user.gold < cost) {
        throw new Error('Not enough gold');
      }
      
      // Deduct gold
      await client.query(
        'UPDATE users SET gold = gold - $1 WHERE id = $2',
        [cost, userId]
      );
      
      // Determine enhancement result
      const roll = Math.random();
      let result;
      
      if (roll <= successRate) {
        // Success
        const newLevel = sword.level + 1;
        const newName = this.getSwordName(newLevel);
        const newPower = this.calculateCurrentPower(sword.base_power, newLevel);
        
        const updateQuery = `
          UPDATE swords 
          SET level = $1, 
              name = $2, 
              current_power = $3,
              enhanced_at = NOW()
          WHERE id = $4
          RETURNING *
        `;
        
        const updateResult = await client.query(updateQuery, [
          newLevel,
          newName,
          newPower,
          swordId
        ]);
        
        result = {
          success: true,
          message: `Enhancement to +${newLevel} succeeded!`,
          sword: updateResult.rows[0],
          cost,
          isMaxLevel: newLevel >= 20
        };
        
      } else if (roll <= successRate + this.getMaintainRate(sword.level)) {
        // Maintain (no change)
        result = {
          success: false,
          maintained: true,
          message: 'Enhancement failed but the sword was not damaged.',
          sword,
          cost
        };
      } else {
        // Destroy
        await client.query(
          'DELETE FROM swords WHERE id = $1',
          [swordId]
        );
        
        // Create a new level 0 sword
        const newSword = await this.createSword(userId, 0);
        
        // Refund some gold (30% of sell value)
        const refund = Math.floor(this.calculateSellValue(sword) * 0.3);
        if (refund > 0) {
          await client.query(
            'UPDATE users SET gold = gold + $1 WHERE id = $2',
            [refund, userId]
          );
        }
        
        result = {
          success: false,
          destroyed: true,
          message: 'Enhancement failed and the sword was destroyed!',
          refund,
          newSword,
          cost
        };
      }
      
      await client.query('COMMIT');
      return result;
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Enhancement error:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  // Calculate base power based on level
  calculateBasePower(level) {
    return 10 + (level * 5);
  },

  // Calculate current power based on base power and level
  calculateCurrentPower(basePower, level) {
    return Math.floor(basePower * (1 + (level * 0.1)));
  },

  // Get sword name based on level
  getSwordName(level) {
    const index = Math.min(
      Math.floor(level / 3),
      SWORD_NAMES.length - 1
    );
    return `[+${level}] ${SWORD_NAMES[index]}`;
  },

  // Get sword description based on level
  getSwordDescription(level) {
    const index = Math.min(
      Math.floor(level / 3),
      SWORD_DESCRIPTIONS.length - 1
    );
    return SWORD_DESCRIPTIONS[index];
  },

  // Calculate enhancement cost and success rate
  calculateEnhancementCostAndRate(level) {
    const baseCost = 100 * Math.pow(1.5, level);
    const cost = Math.floor(baseCost);
    
    // Success rate decreases as level increases
    const baseRate = 0.95 - (level * 0.03);
    const successRate = Math.max(0.1, baseRate); // Minimum 10% success rate
    
    return { cost, successRate };
  },

  // Calculate maintain rate (chance to not break on failure)
  getMaintainRate(level) {
    // Higher levels have a lower chance to maintain on failure
    return Math.max(0.1, 0.5 - (level * 0.02));
  },

  // Calculate sell value of a sword
  calculateSellValue(sword) {
    const baseValue = 50 * Math.pow(1.8, sword.level);
    return Math.floor(sword.is_hidden ? baseValue * 4 : baseValue);
  },

  // Sell a sword
  async sellSword(swordId, userId) {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Get the sword with a lock
      const swordQuery = `
        SELECT * FROM swords 
        WHERE id = $1 AND user_id = $2 
        FOR UPDATE
      `;
      const swordResult = await client.query(swordQuery, [swordId, userId]);
      const sword = swordResult.rows[0];
      
      if (!sword) {
        throw new Error('Sword not found');
      }
      
      // Calculate sell value
      const sellValue = this.calculateSellValue(sword);
      
      // Delete the sword
      await client.query('DELETE FROM swords WHERE id = $1', [swordId]);
      
      // Give user the gold
      await client.query(
        'UPDATE users SET gold = gold + $1 WHERE id = $2',
        [sellValue, userId]
      );
      
      // Create a new level 0 sword if this was their only sword
      const countQuery = 'SELECT COUNT(*) FROM swords WHERE user_id = $1';
      const countResult = await client.query(countQuery, [userId]);
      
      let newSword = null;
      if (parseInt(countResult.rows[0].count) === 0) {
        newSword = await this.createSword(userId, 0);
      }
      
      await client.query('COMMIT');
      
      return {
        success: true,
        goldReceived: sellValue,
        newSword,
        message: `Sold ${sword.name} for ${sellValue}G`
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Sell sword error:', error);
      throw error;
    } finally {
      client.release();
    }
  }
};

export default SwordService;
