import db from './db.service.js';
import SwordService from './sword.service.js';
import UserService from './user.service.js';

const BattleService = {
  // Start a battle between two players
  async startBattle(player1Id, player2Id) {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Get both players' swords with locks
      const [player1Sword, player2Sword] = await Promise.all([
        this.getUserSwordWithLock(client, player1Id),
        this.getUserSwordWithLock(client, player2Id)
      ]);
      
      if (!player1Sword || !player2Sword) {
        throw new Error('One or both players do not have a sword');
      }
      
      // Calculate battle outcome
      const battleResult = this.calculateBattleOutcome(player1Sword, player2Sword);
      
      // Record the battle
      const battleRecord = await this.recordBattle(
        client,
        player1Id,
        player2Id,
        player1Sword.id,
        player2Sword.id,
        battleResult.winnerId
      );
      
      // Distribute rewards
      const rewards = await this.distributeBattleRewards(
        client,
        player1Id,
        player2Id,
        battleResult.winnerId,
        battleResult.isDraw
      );
      
      await client.query('COMMIT');
      
      return {
        ...battleRecord,
        rewards,
        player1Sword,
        player2Sword
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Battle error:', error);
      throw error;
    } finally {
      client.release();
    }
  },
  
  // Get a user's sword with a lock
  async getUserSwordWithLock(client, userId) {
    const query = `
      SELECT * FROM swords 
      WHERE user_id = $1 
      ORDER BY level DESC, created_at DESC 
      LIMIT 1
      FOR UPDATE
    `;
    const result = await client.query(query, [userId]);
    return result.rows[0];
  },
  
  // Calculate the outcome of a battle
  calculateBattleOutcome(sword1, sword2) {
    // Base power comparison
    const powerDiff = sword1.current_power - sword2.current_power;
    
    // Add some randomness (up to 20% of the average power)
    const avgPower = (sword1.current_power + sword2.current_power) / 2;
    const randomFactor = (Math.random() * 0.4 - 0.2) * avgPower; // -20% to +20% of avg power
    
    const totalDiff = powerDiff + randomFactor;
    
    if (Math.abs(totalDiff) < avgPower * 0.05) { // Within 5% is a draw
      return { isDraw: true };
    } else if (totalDiff > 0) {
      return { winnerId: sword1.user_id, isDraw: false };
    } else {
      return { winnerId: sword2.user_id, isDraw: false };
    }
  },
  
  // Record a battle in the database
  async recordBattle(client, player1Id, player2Id, sword1Id, sword2Id, winnerId) {
    const query = `
      INSERT INTO battles (player1_id, player2_id, winner_id, player1_sword_id, player2_sword_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await client.query(query, [
      player1Id,
      player2Id,
      winnerId,
      sword1Id,
      sword2Id
    ]);
    
    return result.rows[0];
  },
  
  // Distribute rewards after a battle
  async distributeBattleRewards(client, player1Id, player2Id, winnerId, isDraw) {
    const baseReward = 100; // Base gold reward
    
    if (isDraw) {
      // Both players get a small reward for a draw
      await Promise.all([
        this.giveBattleReward(client, player1Id, Math.floor(baseReward * 0.5)),
        this.giveBattleReward(client, player2Id, Math.floor(baseReward * 0.5))
      ]);
      
      return {
        player1Reward: Math.floor(baseReward * 0.5),
        player2Reward: Math.floor(baseReward * 0.5),
        isDraw: true
      };
    } else {
      // Winner gets more, loser gets less
      const winnerReward = baseReward * 1.5;
      const loserReward = Math.floor(baseReward * 0.3);
      
      if (winnerId === player1Id) {
        await Promise.all([
          this.giveBattleReward(client, player1Id, winnerReward),
          this.giveBattleReward(client, player2Id, loserReward)
        ]);
        
        return {
          player1Reward: winnerReward,
          player2Reward: loserReward,
          isDraw: false
        };
      } else {
        await Promise.all([
          this.giveBattleReward(client, player1Id, loserReward),
          this.giveBattleReward(client, player2Id, winnerReward)
        ]);
        
        return {
          player1Reward: loserReward,
          player2Reward: winnerReward,
          isDraw: false
        };
      }
    }
  },
  
  // Helper to give battle reward to a player
  async giveBattleReward(client, userId, amount) {
    const query = `
      UPDATE users 
      SET gold = gold + $1,
          battle_count = COALESCE(battle_count, 0) + 1
      WHERE id = $2
      RETURNING *
    `;
    
    await client.query(query, [Math.floor(amount), userId]);
  },
  
  // Get battle history for a user
  async getBattleHistory(userId, limit = 10) {
    const query = `
      SELECT 
        b.*,
        p1.name as player1_name,
        p2.name as player2_name,
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
    
    const result = await db.query(query, [userId, limit]);
    return result.rows;
  },
  
  // Get a random opponent for a player
  async getRandomOpponent(userId) {
    const query = `
      SELECT u.* 
      FROM users u
      WHERE u.id != $1
      ORDER BY RANDOM()
      LIMIT 1
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }
};

export default BattleService;
