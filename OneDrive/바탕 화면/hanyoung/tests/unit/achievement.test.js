/**
 * Unit tests for AchievementSystem
 * Tests for task 9.1: Create Achievement data structures and AchievementSystem class
 */

import { AchievementSystem } from '../../js/systems/AchievementSystem.js';

describe('AchievementSystem - Task 9.1', () => {
    let achievementSystem;

    beforeEach(() => {
        achievementSystem = new AchievementSystem();
    });

    describe('Initialization', () => {
        test('should initialize with predefined achievements', () => {
            expect(achievementSystem.achievements).toBeDefined();
            expect(achievementSystem.achievements.length).toBeGreaterThan(0);
        });

        test('should initialize achievements with all required properties', () => {
            achievementSystem.achievements.forEach(achievement => {
                expect(achievement).toHaveProperty('id');
                expect(achievement).toHaveProperty('title');
                expect(achievement).toHaveProperty('description');
                expect(achievement).toHaveProperty('condition');
                expect(achievement).toHaveProperty('unlocked');
            });
        });

        test('should initialize achievement conditions with required properties', () => {
            achievementSystem.achievements.forEach(achievement => {
                expect(achievement.condition).toHaveProperty('type');
                expect(achievement.condition).toHaveProperty('threshold');
                expect(achievement.condition).toHaveProperty('current');
            });
        });

        test('should initialize all achievements as locked', () => {
            achievementSystem.achievements.forEach(achievement => {
                expect(achievement.unlocked).toBe(false);
                expect(achievement.unlockedAt).toBeUndefined();
            });
        });

        test('should initialize with specific predefined achievements', () => {
            const achievementIds = achievementSystem.achievements.map(a => a.id);
            
            expect(achievementIds).toContain('first_merge');
            expect(achievementIds).toContain('merge_master');
            expect(achievementIds).toContain('level_10');
            expect(achievementIds).toContain('gold_millionaire');
        });

        test('should initialize first_merge achievement correctly', () => {
            const firstMerge = achievementSystem.achievements.find(a => a.id === 'first_merge');
            
            expect(firstMerge.title).toBe('First Merge');
            expect(firstMerge.description).toBe('Merge your first sword');
            expect(firstMerge.condition.type).toBe('total_merges');
            expect(firstMerge.condition.threshold).toBe(1);
            expect(firstMerge.condition.current).toBe(0);
        });

        test('should initialize merge_master achievement correctly', () => {
            const mergeMaster = achievementSystem.achievements.find(a => a.id === 'merge_master');
            
            expect(mergeMaster.title).toBe('Merge Master');
            expect(mergeMaster.description).toBe('Perform 100 merges');
            expect(mergeMaster.condition.type).toBe('total_merges');
            expect(mergeMaster.condition.threshold).toBe(100);
            expect(mergeMaster.condition.current).toBe(0);
        });

        test('should initialize level_10 achievement correctly', () => {
            const level10 = achievementSystem.achievements.find(a => a.id === 'level_10');
            
            expect(level10.title).toBe('Level 10 Sword');
            expect(level10.description).toBe('Create a level 10 sword');
            expect(level10.condition.type).toBe('max_level');
            expect(level10.condition.threshold).toBe(10);
            expect(level10.condition.current).toBe(0);
        });

        test('should initialize gold_millionaire achievement correctly', () => {
            const millionaire = achievementSystem.achievements.find(a => a.id === 'gold_millionaire');
            
            expect(millionaire.title).toBe('Millionaire');
            expect(millionaire.description).toBe('Accumulate 1,000,000 gold');
            expect(millionaire.condition.type).toBe('total_gold');
            expect(millionaire.condition.threshold).toBe(1000000);
            expect(millionaire.condition.current).toBe(0);
        });
    });

    describe('checkAchievements()', () => {
        test('should return empty array when no achievements are unlocked', () => {
            const stats = {
                totalMerges: 0,
                maxLevel: 0,
                totalGoldEarned: 0,
                totalEnhancements: 0
            };
            
            const unlocked = achievementSystem.checkAchievements(stats);
            
            expect(unlocked).toEqual([]);
        });

        test('should unlock first_merge achievement when totalMerges reaches 1', () => {
            const stats = {
                totalMerges: 1,
                maxLevel: 0,
                totalGoldEarned: 0,
                totalEnhancements: 0
            };
            
            const unlocked = achievementSystem.checkAchievements(stats);
            
            expect(unlocked.length).toBe(1);
            expect(unlocked[0].id).toBe('first_merge');
            
            const firstMerge = achievementSystem.achievements.find(a => a.id === 'first_merge');
            expect(firstMerge.unlocked).toBe(true);
        });

        test('should unlock merge_master achievement when totalMerges reaches 100', () => {
            const stats = {
                totalMerges: 100,
                maxLevel: 0,
                totalGoldEarned: 0,
                totalEnhancements: 0
            };
            
            const unlocked = achievementSystem.checkAchievements(stats);
            
            expect(unlocked.length).toBe(2); // first_merge and merge_master
            expect(unlocked.some(a => a.id === 'merge_master')).toBe(true);
        });

        test('should unlock level_10 achievement when maxLevel reaches 10', () => {
            const stats = {
                totalMerges: 0,
                maxLevel: 10,
                totalGoldEarned: 0,
                totalEnhancements: 0
            };
            
            const unlocked = achievementSystem.checkAchievements(stats);
            
            expect(unlocked.length).toBe(1);
            expect(unlocked[0].id).toBe('level_10');
        });

        test('should unlock gold_millionaire achievement when totalGoldEarned reaches 1000000', () => {
            const stats = {
                totalMerges: 0,
                maxLevel: 0,
                totalGoldEarned: 1000000,
                totalEnhancements: 0
            };
            
            const unlocked = achievementSystem.checkAchievements(stats);
            
            expect(unlocked.length).toBe(1);
            expect(unlocked[0].id).toBe('gold_millionaire');
        });

        test('should unlock multiple achievements at once', () => {
            const stats = {
                totalMerges: 100,
                maxLevel: 10,
                totalGoldEarned: 1000000,
                totalEnhancements: 0
            };
            
            const unlocked = achievementSystem.checkAchievements(stats);
            
            expect(unlocked.length).toBe(4); // All achievements
        });

        test('should update achievement current progress', () => {
            const stats = {
                totalMerges: 50,
                maxLevel: 5,
                totalGoldEarned: 500000,
                totalEnhancements: 0
            };
            
            achievementSystem.checkAchievements(stats);
            
            const mergeMaster = achievementSystem.achievements.find(a => a.id === 'merge_master');
            expect(mergeMaster.condition.current).toBe(50);
            
            const level10 = achievementSystem.achievements.find(a => a.id === 'level_10');
            expect(level10.condition.current).toBe(5);
            
            const millionaire = achievementSystem.achievements.find(a => a.id === 'gold_millionaire');
            expect(millionaire.condition.current).toBe(500000);
        });

        test('should not unlock already unlocked achievements again', () => {
            const stats = {
                totalMerges: 1,
                maxLevel: 0,
                totalGoldEarned: 0,
                totalEnhancements: 0
            };
            
            // First check - should unlock
            const firstUnlock = achievementSystem.checkAchievements(stats);
            expect(firstUnlock.length).toBe(1);
            
            // Second check - should not unlock again
            const secondUnlock = achievementSystem.checkAchievements(stats);
            expect(secondUnlock.length).toBe(0);
        });

        test('should handle stats with missing properties', () => {
            const stats = {};
            
            expect(() => {
                achievementSystem.checkAchievements(stats);
            }).not.toThrow();
            
            // All current values should be 0
            achievementSystem.achievements.forEach(achievement => {
                expect(achievement.condition.current).toBe(0);
            });
        });

        test('should unlock achievement when threshold is exceeded', () => {
            const stats = {
                totalMerges: 150,
                maxLevel: 0,
                totalGoldEarned: 0,
                totalEnhancements: 0
            };
            
            const unlocked = achievementSystem.checkAchievements(stats);
            
            expect(unlocked.some(a => a.id === 'merge_master')).toBe(true);
        });

        test('should unlock achievement when threshold is exactly met', () => {
            const stats = {
                totalMerges: 100,
                maxLevel: 0,
                totalGoldEarned: 0,
                totalEnhancements: 0
            };
            
            const unlocked = achievementSystem.checkAchievements(stats);
            
            expect(unlocked.some(a => a.id === 'merge_master')).toBe(true);
        });
    });

    describe('unlockAchievement()', () => {
        test('should unlock achievement by ID', () => {
            achievementSystem.unlockAchievement('first_merge');
            
            const firstMerge = achievementSystem.achievements.find(a => a.id === 'first_merge');
            expect(firstMerge.unlocked).toBe(true);
        });

        test('should set unlockedAt timestamp', () => {
            const beforeUnlock = new Date();
            achievementSystem.unlockAchievement('first_merge');
            const afterUnlock = new Date();
            
            const firstMerge = achievementSystem.achievements.find(a => a.id === 'first_merge');
            expect(firstMerge.unlockedAt).toBeDefined();
            expect(firstMerge.unlockedAt).toBeInstanceOf(Date);
            expect(firstMerge.unlockedAt.getTime()).toBeGreaterThanOrEqual(beforeUnlock.getTime());
            expect(firstMerge.unlockedAt.getTime()).toBeLessThanOrEqual(afterUnlock.getTime());
        });

        test('should not unlock non-existent achievement', () => {
            expect(() => {
                achievementSystem.unlockAchievement('nonexistent_achievement');
            }).not.toThrow();
        });

        test('should not change already unlocked achievement timestamp', () => {
            achievementSystem.unlockAchievement('first_merge');
            const firstMerge = achievementSystem.achievements.find(a => a.id === 'first_merge');
            const firstTimestamp = firstMerge.unlockedAt;
            
            // Wait a bit and try to unlock again
            setTimeout(() => {
                achievementSystem.unlockAchievement('first_merge');
                expect(firstMerge.unlockedAt).toBe(firstTimestamp);
            }, 10);
        });

        test('should unlock multiple achievements independently', () => {
            achievementSystem.unlockAchievement('first_merge');
            achievementSystem.unlockAchievement('level_10');
            
            const firstMerge = achievementSystem.achievements.find(a => a.id === 'first_merge');
            const level10 = achievementSystem.achievements.find(a => a.id === 'level_10');
            const mergeMaster = achievementSystem.achievements.find(a => a.id === 'merge_master');
            
            expect(firstMerge.unlocked).toBe(true);
            expect(level10.unlocked).toBe(true);
            expect(mergeMaster.unlocked).toBe(false);
        });
    });

    describe('getProgress()', () => {
        test('should return 0 for achievement with no progress', () => {
            const progress = achievementSystem.getProgress('first_merge');
            
            expect(progress).toBe(0);
        });

        test('should return 100 for unlocked achievement', () => {
            achievementSystem.unlockAchievement('first_merge');
            
            const progress = achievementSystem.getProgress('first_merge');
            
            expect(progress).toBe(100);
        });

        test('should return correct percentage for partial progress', () => {
            const stats = {
                totalMerges: 50,
                maxLevel: 0,
                totalGoldEarned: 0,
                totalEnhancements: 0
            };
            
            achievementSystem.checkAchievements(stats);
            
            const progress = achievementSystem.getProgress('merge_master');
            
            expect(progress).toBe(50); // 50/100 = 50%
        });

        test('should return 0 for non-existent achievement', () => {
            const progress = achievementSystem.getProgress('nonexistent_achievement');
            
            expect(progress).toBe(0);
        });

        test('should return correct percentage for different thresholds', () => {
            const stats = {
                totalMerges: 0,
                maxLevel: 5,
                totalGoldEarned: 0,
                totalEnhancements: 0
            };
            
            achievementSystem.checkAchievements(stats);
            
            const progress = achievementSystem.getProgress('level_10');
            
            expect(progress).toBe(50); // 5/10 = 50%
        });

        test('should return correct percentage for large numbers', () => {
            const stats = {
                totalMerges: 0,
                maxLevel: 0,
                totalGoldEarned: 250000,
                totalEnhancements: 0
            };
            
            achievementSystem.checkAchievements(stats);
            
            const progress = achievementSystem.getProgress('gold_millionaire');
            
            expect(progress).toBe(25); // 250000/1000000 = 25%
        });

        test('should not exceed 100 percent', () => {
            const stats = {
                totalMerges: 200,
                maxLevel: 0,
                totalGoldEarned: 0,
                totalEnhancements: 0
            };
            
            achievementSystem.checkAchievements(stats);
            
            const progress = achievementSystem.getProgress('merge_master');
            
            expect(progress).toBeLessThanOrEqual(100);
        });

        test('should not return negative progress', () => {
            const stats = {
                totalMerges: -10,
                maxLevel: 0,
                totalGoldEarned: 0,
                totalEnhancements: 0
            };
            
            achievementSystem.checkAchievements(stats);
            
            const progress = achievementSystem.getProgress('first_merge');
            
            expect(progress).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Achievement scenarios', () => {
        test('should handle complete achievement workflow', () => {
            // Initial state
            let progress = achievementSystem.getProgress('first_merge');
            expect(progress).toBe(0);
            
            // Make progress
            let stats = {
                totalMerges: 0,
                maxLevel: 0,
                totalGoldEarned: 0,
                totalEnhancements: 0
            };
            let unlocked = achievementSystem.checkAchievements(stats);
            expect(unlocked.length).toBe(0);
            
            // Complete achievement
            stats.totalMerges = 1;
            unlocked = achievementSystem.checkAchievements(stats);
            expect(unlocked.length).toBe(1);
            expect(unlocked[0].id).toBe('first_merge');
            
            // Verify unlocked
            const firstMerge = achievementSystem.achievements.find(a => a.id === 'first_merge');
            expect(firstMerge.unlocked).toBe(true);
            expect(firstMerge.unlockedAt).toBeDefined();
            
            // Progress should be 100
            progress = achievementSystem.getProgress('first_merge');
            expect(progress).toBe(100);
        });

        test('should track progress across multiple checks', () => {
            // First check - 25% progress
            let stats = {
                totalMerges: 25,
                maxLevel: 0,
                totalGoldEarned: 0,
                totalEnhancements: 0
            };
            achievementSystem.checkAchievements(stats);
            expect(achievementSystem.getProgress('merge_master')).toBe(25);
            
            // Second check - 50% progress
            stats.totalMerges = 50;
            achievementSystem.checkAchievements(stats);
            expect(achievementSystem.getProgress('merge_master')).toBe(50);
            
            // Third check - 75% progress
            stats.totalMerges = 75;
            achievementSystem.checkAchievements(stats);
            expect(achievementSystem.getProgress('merge_master')).toBe(75);
            
            // Fourth check - 100% progress (unlocked)
            stats.totalMerges = 100;
            const unlocked = achievementSystem.checkAchievements(stats);
            expect(unlocked.some(a => a.id === 'merge_master')).toBe(true);
            expect(achievementSystem.getProgress('merge_master')).toBe(100);
        });

        test('should handle unlocking all achievements', () => {
            const stats = {
                totalMerges: 100,
                maxLevel: 10,
                totalGoldEarned: 1000000,
                totalEnhancements: 50
            };
            
            const unlocked = achievementSystem.checkAchievements(stats);
            
            expect(unlocked.length).toBe(4);
            
            achievementSystem.achievements.forEach(achievement => {
                expect(achievement.unlocked).toBe(true);
                expect(achievement.unlockedAt).toBeDefined();
                expect(achievementSystem.getProgress(achievement.id)).toBe(100);
            });
        });

        test('should handle incremental unlocking', () => {
            // Unlock first achievement
            let stats = { totalMerges: 1, maxLevel: 0, totalGoldEarned: 0, totalEnhancements: 0 };
            let unlocked = achievementSystem.checkAchievements(stats);
            expect(unlocked.length).toBe(1);
            
            // Unlock second achievement
            stats.maxLevel = 10;
            unlocked = achievementSystem.checkAchievements(stats);
            expect(unlocked.length).toBe(1);
            expect(unlocked[0].id).toBe('level_10');
            
            // Unlock third achievement
            stats.totalMerges = 100;
            unlocked = achievementSystem.checkAchievements(stats);
            expect(unlocked.length).toBe(1);
            expect(unlocked[0].id).toBe('merge_master');
            
            // Unlock fourth achievement
            stats.totalGoldEarned = 1000000;
            unlocked = achievementSystem.checkAchievements(stats);
            expect(unlocked.length).toBe(1);
            expect(unlocked[0].id).toBe('gold_millionaire');
            
            // All should be unlocked now
            const allUnlocked = achievementSystem.achievements.every(a => a.unlocked);
            expect(allUnlocked).toBe(true);
        });
    });

    describe('Edge cases', () => {
        test('should handle very large stat values', () => {
            const stats = {
                totalMerges: 999999999,
                maxLevel: 999999,
                totalGoldEarned: 999999999999,
                totalEnhancements: 999999
            };
            
            expect(() => {
                achievementSystem.checkAchievements(stats);
            }).not.toThrow();
            
            achievementSystem.achievements.forEach(achievement => {
                expect(achievement.unlocked).toBe(true);
            });
        });

        test('should handle negative stat values', () => {
            const stats = {
                totalMerges: -10,
                maxLevel: -5,
                totalGoldEarned: -1000,
                totalEnhancements: -20
            };
            
            expect(() => {
                achievementSystem.checkAchievements(stats);
            }).not.toThrow();
            
            achievementSystem.achievements.forEach(achievement => {
                expect(achievement.unlocked).toBe(false);
            });
        });

        test('should handle decimal stat values', () => {
            const stats = {
                totalMerges: 1.5,
                maxLevel: 10.7,
                totalGoldEarned: 1000000.99,
                totalEnhancements: 5.2
            };
            
            const unlocked = achievementSystem.checkAchievements(stats);
            
            // Should unlock based on >= comparison
            expect(unlocked.length).toBeGreaterThan(0);
        });

        test('should handle null stats object', () => {
            expect(() => {
                achievementSystem.checkAchievements(null);
            }).toThrow();
        });

        test('should handle undefined stats object', () => {
            expect(() => {
                achievementSystem.checkAchievements(undefined);
            }).toThrow();
        });
    });
});
