import express from 'express';
import { body, param, validationResult } from 'express-validator';
import SwordService from '../services/sword.service.js';
import BattleService from '../services/battle.service.js';
import UserService from '../services/user.service.js';

const router = express.Router();

// Enhance a sword
router.post(
  '/enhance',
  [
    body('swordId').isUUID().withMessage('Invalid sword ID')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { swordId } = req.body;
      const userId = req.user.id;
      
      // Get the sword to ensure it belongs to the user
      const sword = await SwordService.getUserSword(userId);
      if (!sword || sword.id !== swordId) {
        return res.status(404).json({ error: 'Sword not found' });
      }
      
      // Check if sword is already at max level
      if (sword.level >= 20) {
        return res.status(400).json({ 
          error: 'Sword is already at maximum level',
          sword
        });
      }
      
      // Perform enhancement
      const result = await SwordService.enhanceSword(swordId, userId);
      
      // Prepare response
      const response = {
        message: result.message,
        cost: result.cost,
        sword: result.sword || result.newSword,
        isSuccess: result.success,
        isDestroyed: result.destroyed,
        refund: result.refund || 0
      };
      
      // Add blacksmith message based on result
      if (result.success) {
        response.blacksmithMessage = this.getBlacksmithMessage(result.sword.level, true);
      } else if (result.destroyed) {
        response.blacksmithMessage = '아... 검을 망가뜨렸구나. 다시 시작해야겠군.';
      } else {
        response.blacksmithMessage = this.getBlacksmithMessage(sword.level, false);
      }
      
      res.json(response);
      
    } catch (error) {
      console.error('Enhancement error:', error);
      res.status(500).json({ 
        error: error.message || 'Enhancement failed',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
);

// Start a random battle
router.post('/battle/random', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get a random opponent
    const opponent = await BattleService.getRandomOpponent(userId);
    if (!opponent) {
      return res.status(404).json({ error: 'No opponents available' });
    }
    
    // Start the battle
    const battleResult = await BattleService.startBattle(userId, opponent.id);
    
    // Format the response
    const response = {
      battleId: battleResult.id,
      opponent: {
        id: battleResult.player2_id,
        name: battleResult.player2_name,
        sword: {
          name: battleResult.player2_sword_name
        }
      },
      isDraw: battleResult.winner_id === null,
      isWinner: battleResult.winner_id === userId,
      rewards: battleResult.rewards,
      timestamp: battleResult.created_at
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Battle error:', error);
    res.status(500).json({ 
      error: 'Battle failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Battle a specific user
router.post(
  '/battle/:userId',
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
      const currentUserId = req.user.id;
      
      if (userId === currentUserId) {
        return res.status(400).json({ error: 'Cannot battle yourself' });
      }
      
      // Check if opponent exists
      const opponent = await UserService.getUserById(userId);
      if (!opponent) {
        return res.status(404).json({ error: 'Opponent not found' });
      }
      
      // Start the battle
      const battleResult = await BattleService.startBattle(currentUserId, userId);
      
      // Format the response
      const response = {
        battleId: battleResult.id,
        opponent: {
          id: battleResult.player2_id,
          name: opponent.name,
          sword: {
            name: battleResult.player2_sword_name
          }
        },
        isDraw: battleResult.winner_id === null,
        isWinner: battleResult.winner_id === currentUserId,
        rewards: battleResult.rewards,
        timestamp: battleResult.created_at
      };
      
      res.json(response);
      
    } catch (error) {
      console.error('Battle error:', error);
      res.status(500).json({ 
        error: 'Battle failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Get battle history
router.get('/battles', async (req, res) => {
  try {
    const userId = req.user.id;
    const battles = await BattleService.getBattleHistory(userId, 20);
    
    // Format the battle history
    const formattedBattles = battles.map(battle => ({
      id: battle.id,
      opponent: battle.player1_id === userId ? battle.player2_name : battle.player1_name,
      opponentSword: battle.player1_id === userId ? battle.player2_sword_name : battle.player1_sword_name,
      yourSword: battle.player1_id === userId ? battle.player1_sword_name : battle.player2_sword_name,
      result: battle.winner_id === null ? 'draw' : (battle.winner_id === userId ? 'win' : 'loss'),
      timestamp: battle.created_at
    }));
    
    res.json({ battles: formattedBattles });
    
  } catch (error) {
    console.error('Battle history error:', error);
    res.status(500).json({ error: 'Failed to fetch battle history' });
  }
});

// Claim daily reward
router.post('/daily-reward', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserService.getUserById(userId);
    
    // Check if user has already claimed today's reward
    const lastLogin = new Date(user.last_login);
    const now = new Date();
    const isSameDay = lastLogin.getDate() === now.getDate() && 
                     lastLogin.getMonth() === now.getMonth() && 
                     lastLogin.getFullYear() === now.getFullYear();
    
    if (isSameDay && user.login_streak > 0) {
      return res.status(400).json({ 
        error: 'Daily reward already claimed',
        nextReward: 'tomorrow'
      });
    }
    
    // Calculate reward based on streak
    const baseReward = 1000; // Base 1000G
    const streakBonus = Math.min(user.login_streak * 100, 2000); // Max 2000G bonus
    const totalReward = baseReward + streakBonus;
    
    // Update user with reward
    const updatedUser = await UserService.updateUserGold(userId, totalReward);
    await UserService.updateLastLogin(userId);
    
    res.json({
      success: true,
      reward: totalReward,
      streak: user.login_streak + 1,
      message: `Claimed ${totalReward}G daily reward!`,
      nextReward: 'tomorrow'
    });
    
  } catch (error) {
    console.error('Daily reward error:', error);
    res.status(500).json({ error: 'Failed to claim daily reward' });
  }
});

// Get blacksmith message based on enhancement result
function getBlacksmithMessage(level, isSuccess) {
  const messages = {
    success: [
      '좋아, 이 정도면 괜찮은 검이다!',
      '수고했어! 이제 조금 더 강해졌어!',
      '흠, 나쁘지 않은데?',
      '이 정도면 쓸만한 검인 것 같아!',
      '좋아, 계속 이렇게만 하면 대장장이로 인정해주지!'
    ],
    fail: [
      '음... 실패했네. 하지만 포기하지 마!',
      '이런, 아깝게 실패했어. 다음엔 꼭 성공할 거야!',
      '괜찮아, 실패는 성공의 어머니라고 하지 않았나?',
      '조금만 더 노력하면 분명 성공할 거야!',
      '다음엔 꼭 성공하자고!'
    ]
  };
  
  // Special messages for certain levels
  if (level >= 15) {
    return isSuccess 
      ? '놀라운데? 이건 정말 대단한 검이다!'
      : '이런 고레벨 검을 강화하는 건 쉽지 않지...';
  }
  
  if (level >= 10) {
    return isSuccess
      ? '와우, 정말 잘했어! 이제 진짜 강한 검을 만들고 있어!'
      : '아쉽군. 이 정도 레벨에서는 실패도 자주 있을 거야.';
  }
  
  // Random message for other cases
  const msgList = isSuccess ? messages.success : messages.fail;
  return msgList[Math.floor(Math.random() * msgList.length)];
}

export default router;
