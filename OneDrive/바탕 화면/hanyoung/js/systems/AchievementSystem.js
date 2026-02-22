/**
 * Achievement System - Tracks player milestones and unlocks
 * Requirements: 8.1, 8.2, 8.5
 */

/**
 * @typedef {Object} AchievementCondition
 * @property {'total_merges' | 'max_level' | 'total_gold' | 'total_enhancements'} type - The type of condition
 * @property {number} threshold - The target value to reach
 * @property {number} current - The current progress value
 */

/**
 * @typedef {Object} Achievement
 * @property {string} id - Unique identifier for the achievement
 * @property {string} title - Display title of the achievement
 * @property {string} description - Description of what the achievement requires
 * @property {AchievementCondition} condition - The condition that must be met
 * @property {boolean} unlocked - Whether the achievement has been unlocked
 * @property {Date} [unlockedAt] - When the achievement was unlocked (if unlocked)
 */

export class AchievementSystem {
    constructor() {
        this.achievements = this.initializeAchievements();
    }

    /**
     * Initialize all achievements with their conditions
     * @returns {Achievement[]} Array of achievement objects
     * @private
     */
    initializeAchievements() {
        return [
            {
                id: 'first_merge',
                title: 'First Merge',
                description: 'Merge your first sword',
                condition: { type: 'total_merges', threshold: 1, current: 0 },
                unlocked: false
            },
            {
                id: 'merge_master',
                title: 'Merge Master',
                description: 'Perform 100 merges',
                condition: { type: 'total_merges', threshold: 100, current: 0 },
                unlocked: false
            },
            {
                id: 'level_10',
                title: 'Level 10 Sword',
                description: 'Create a level 10 sword',
                condition: { type: 'max_level', threshold: 10, current: 0 },
                unlocked: false
            },
            {
                id: 'gold_millionaire',
                title: 'Millionaire',
                description: 'Accumulate 1,000,000 gold',
                condition: { type: 'total_gold', threshold: 1000000, current: 0 },
                unlocked: false
            }
        ];
    }

    /**
     * Check achievements against player stats and unlock if conditions met
     * @param {Object} stats - PlayerStats object with totalMerges, maxLevel, totalGoldEarned, totalEnhancements
     * @returns {Array} Array of newly unlocked achievements
     */
    checkAchievements(stats) {
        const newlyUnlocked = [];

        for (const achievement of this.achievements) {
            // Skip already unlocked achievements
            if (achievement.unlocked) {
                continue;
            }

            // Update current progress based on condition type
            switch (achievement.condition.type) {
                case 'total_merges':
                    achievement.condition.current = stats.totalMerges || 0;
                    break;
                case 'max_level':
                    achievement.condition.current = stats.maxLevel || 0;
                    break;
                case 'total_gold':
                    achievement.condition.current = stats.totalGoldEarned || 0;
                    break;
                case 'total_enhancements':
                    achievement.condition.current = stats.totalEnhancements || 0;
                    break;
            }

            // Check if condition is met
            if (achievement.condition.current >= achievement.condition.threshold) {
                this.unlockAchievement(achievement.id);
                newlyUnlocked.push(achievement);
            }
        }

        return newlyUnlocked;
    }

    /**
     * Unlock a specific achievement
     * @param {string} achievementId - The achievement ID to unlock
     */
    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date();
        }
    }

    /**
     * Get progress percentage for an achievement
     * @param {string} achievementId - The achievement ID
     * @returns {number} Progress percentage (0-100)
     */
    getProgress(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        
        if (!achievement) {
            return 0;
        }

        if (achievement.unlocked) {
            return 100;
        }

        const progress = (achievement.condition.current / achievement.condition.threshold) * 100;
        return Math.min(100, Math.max(0, progress));
    }
}
