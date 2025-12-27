import express from 'express';
import RewardService from '../services/reward.service.js';

const router = express.Router();

/**
 * @route   POST /api/rewards/daily
 * @desc    Claim daily login reward
 * @access  Private
 */
router.post('/daily', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await RewardService.claimDailyReward(userId);
    
    res.status(200).json({
      success: true,
      message: `Daily reward claimed! Received ${result.reward}G`,
      ...result
    });
    
  } catch (error) {
    console.error('Daily reward error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to claim daily reward'
    });
  }
});

export default router;
