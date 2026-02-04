/**
 * Unit tests for QuestSystem
 * Tests for task 8.1: Create Quest data structures and QuestSystem class
 */

import { QuestSystem } from '../../js/systems/QuestSystem.js';

describe('QuestSystem - Task 8.1', () => {
    let questSystem;

    beforeEach(() => {
        questSystem = new QuestSystem();
    });

    describe('Initialization', () => {
        test('should initialize with empty activeQuests array', () => {
            expect(questSystem.activeQuests).toEqual([]);
        });
    });

    describe('generateDailyQuests()', () => {
        test('should generate exactly 3 quests', () => {
            const quests = questSystem.generateDailyQuests();
            
            expect(quests).toHaveLength(3);
            expect(questSystem.activeQuests).toHaveLength(3);
        });

        test('should generate quests with all required properties', () => {
            const quests = questSystem.generateDailyQuests();
            
            quests.forEach(quest => {
                expect(quest).toHaveProperty('id');
                expect(quest).toHaveProperty('title');
                expect(quest).toHaveProperty('description');
                expect(quest).toHaveProperty('objective');
                expect(quest).toHaveProperty('reward');
                expect(quest).toHaveProperty('completed');
                expect(quest).toHaveProperty('claimed');
            });
        });

        test('should generate quests with valid objective structure', () => {
            const quests = questSystem.generateDailyQuests();
            
            quests.forEach(quest => {
                expect(quest.objective).toHaveProperty('type');
                expect(quest.objective).toHaveProperty('target');
                expect(quest.objective).toHaveProperty('current');
                
                // Validate objective type
                expect(['merge', 'enhance', 'sell', 'purchase']).toContain(quest.objective.type);
                
                // Validate target is positive
                expect(quest.objective.target).toBeGreaterThan(0);
                
                // Validate current starts at 0
                expect(quest.objective.current).toBe(0);
            });
        });

        test('should generate quests with non-empty titles and descriptions', () => {
            const quests = questSystem.generateDailyQuests();
            
            quests.forEach(quest => {
                expect(quest.title).toBeTruthy();
                expect(quest.title.length).toBeGreaterThan(0);
                expect(quest.description).toBeTruthy();
                expect(quest.description.length).toBeGreaterThan(0);
            });
        });

        test('should generate quests with positive reward amounts', () => {
            const quests = questSystem.generateDailyQuests();
            
            quests.forEach(quest => {
                expect(quest.reward).toBeGreaterThan(0);
            });
        });

        test('should initialize quests as not completed and not claimed', () => {
            const quests = questSystem.generateDailyQuests();
            
            quests.forEach(quest => {
                expect(quest.completed).toBe(false);
                expect(quest.claimed).toBe(false);
            });
        });

        test('should generate quests with unique IDs', () => {
            const quests = questSystem.generateDailyQuests();
            const ids = quests.map(q => q.id);
            const uniqueIds = new Set(ids);
            
            expect(uniqueIds.size).toBe(3);
        });

        test('should replace previous quests when called again', () => {
            const firstQuests = questSystem.generateDailyQuests();
            const firstIds = firstQuests.map(q => q.id);
            
            const secondQuests = questSystem.generateDailyQuests();
            const secondIds = secondQuests.map(q => q.id);
            
            // IDs should be different (new quests generated)
            expect(firstIds).not.toEqual(secondIds);
            expect(questSystem.activeQuests).toHaveLength(3);
        });
    });

    describe('updateProgress()', () => {
        beforeEach(() => {
            questSystem.generateDailyQuests();
        });

        test('should update progress for matching quest type', () => {
            // Find a quest with specific type
            const mergeQuest = questSystem.activeQuests.find(q => q.objective.type === 'merge');
            
            if (mergeQuest) {
                const initialProgress = mergeQuest.objective.current;
                questSystem.updateProgress('merge', 5);
                
                expect(mergeQuest.objective.current).toBe(initialProgress + 5);
            }
        });

        test('should update progress by 1 when amount not specified', () => {
            const quest = questSystem.activeQuests[0];
            const type = quest.objective.type;
            const initialProgress = quest.objective.current;
            
            questSystem.updateProgress(type);
            
            expect(quest.objective.current).toBe(initialProgress + 1);
        });

        test('should not update progress for non-matching quest types', () => {
            const initialStates = questSystem.activeQuests.map(q => ({
                id: q.id,
                current: q.objective.current
            }));
            
            questSystem.updateProgress('nonexistent_type', 10);
            
            questSystem.activeQuests.forEach((quest, index) => {
                expect(quest.objective.current).toBe(initialStates[index].current);
            });
        });

        test('should mark quest as completed when target is reached', () => {
            const quest = questSystem.activeQuests[0];
            const type = quest.objective.type;
            const target = quest.objective.target;
            
            questSystem.updateProgress(type, target);
            
            expect(quest.completed).toBe(true);
            expect(quest.objective.current).toBeGreaterThanOrEqual(quest.objective.target);
        });

        test('should mark quest as completed when target is exceeded', () => {
            const quest = questSystem.activeQuests[0];
            const type = quest.objective.type;
            const target = quest.objective.target;
            
            questSystem.updateProgress(type, target + 10);
            
            expect(quest.completed).toBe(true);
            expect(quest.objective.current).toBeGreaterThan(quest.objective.target);
        });

        test('should not update progress for claimed quests', () => {
            const quest = questSystem.activeQuests[0];
            const type = quest.objective.type;
            
            // Complete and claim the quest
            questSystem.updateProgress(type, quest.objective.target);
            questSystem.claimReward(quest.id);
            
            const progressAfterClaim = quest.objective.current;
            
            // Try to update progress after claiming
            questSystem.updateProgress(type, 10);
            
            expect(quest.objective.current).toBe(progressAfterClaim);
        });

        test('should update multiple quests of the same type', () => {
            // Create a scenario with multiple merge quests
            questSystem.activeQuests = [
                {
                    id: 'quest1',
                    title: 'Merge Quest 1',
                    description: 'Merge swords',
                    objective: { type: 'merge', target: 10, current: 0 },
                    reward: 100,
                    completed: false,
                    claimed: false
                },
                {
                    id: 'quest2',
                    title: 'Merge Quest 2',
                    description: 'Merge more swords',
                    objective: { type: 'merge', target: 20, current: 0 },
                    reward: 200,
                    completed: false,
                    claimed: false
                }
            ];
            
            questSystem.updateProgress('merge', 5);
            
            expect(questSystem.activeQuests[0].objective.current).toBe(5);
            expect(questSystem.activeQuests[1].objective.current).toBe(5);
        });
    });

    describe('checkCompletion()', () => {
        beforeEach(() => {
            questSystem.generateDailyQuests();
        });

        test('should return false for incomplete quest', () => {
            const quest = questSystem.activeQuests[0];
            
            expect(questSystem.checkCompletion(quest.id)).toBe(false);
        });

        test('should return true when quest objective is met', () => {
            const quest = questSystem.activeQuests[0];
            const type = quest.objective.type;
            
            questSystem.updateProgress(type, quest.objective.target);
            
            expect(questSystem.checkCompletion(quest.id)).toBe(true);
        });

        test('should return true when quest objective is exceeded', () => {
            const quest = questSystem.activeQuests[0];
            const type = quest.objective.type;
            
            questSystem.updateProgress(type, quest.objective.target + 10);
            
            expect(questSystem.checkCompletion(quest.id)).toBe(true);
        });

        test('should return false for non-existent quest ID', () => {
            expect(questSystem.checkCompletion('nonexistent-id')).toBe(false);
        });

        test('should return true for quest at exact target', () => {
            const quest = questSystem.activeQuests[0];
            quest.objective.current = quest.objective.target;
            
            expect(questSystem.checkCompletion(quest.id)).toBe(true);
        });
    });

    describe('claimReward()', () => {
        beforeEach(() => {
            questSystem.generateDailyQuests();
        });

        test('should return reward amount for completed quest', () => {
            const quest = questSystem.activeQuests[0];
            const type = quest.objective.type;
            
            questSystem.updateProgress(type, quest.objective.target);
            const reward = questSystem.claimReward(quest.id);
            
            expect(reward).toBe(quest.reward);
        });

        test('should mark quest as claimed', () => {
            const quest = questSystem.activeQuests[0];
            const type = quest.objective.type;
            
            questSystem.updateProgress(type, quest.objective.target);
            questSystem.claimReward(quest.id);
            
            expect(quest.claimed).toBe(true);
        });

        test('should return 0 for incomplete quest', () => {
            const quest = questSystem.activeQuests[0];
            
            const reward = questSystem.claimReward(quest.id);
            
            expect(reward).toBe(0);
            expect(quest.claimed).toBe(false);
        });

        test('should return 0 for already claimed quest', () => {
            const quest = questSystem.activeQuests[0];
            const type = quest.objective.type;
            
            // Complete and claim once
            questSystem.updateProgress(type, quest.objective.target);
            const firstReward = questSystem.claimReward(quest.id);
            
            // Try to claim again
            const secondReward = questSystem.claimReward(quest.id);
            
            expect(firstReward).toBe(quest.reward);
            expect(secondReward).toBe(0);
        });

        test('should return 0 for non-existent quest ID', () => {
            const reward = questSystem.claimReward('nonexistent-id');
            
            expect(reward).toBe(0);
        });

        test('should not mark incomplete quest as claimed', () => {
            const quest = questSystem.activeQuests[0];
            
            questSystem.claimReward(quest.id);
            
            expect(quest.claimed).toBe(false);
        });
    });

    describe('Quest scenarios', () => {
        test('should handle complete quest workflow', () => {
            questSystem.generateDailyQuests();
            const quest = questSystem.activeQuests[0];
            const type = quest.objective.type;
            
            // Initial state
            expect(quest.completed).toBe(false);
            expect(quest.claimed).toBe(false);
            expect(quest.objective.current).toBe(0);
            
            // Make progress
            questSystem.updateProgress(type, 5);
            expect(quest.objective.current).toBe(5);
            expect(quest.completed).toBe(false);
            
            // Complete quest
            questSystem.updateProgress(type, quest.objective.target);
            expect(quest.completed).toBe(true);
            expect(questSystem.checkCompletion(quest.id)).toBe(true);
            
            // Claim reward
            const reward = questSystem.claimReward(quest.id);
            expect(reward).toBe(quest.reward);
            expect(quest.claimed).toBe(true);
            
            // Cannot claim again
            const secondReward = questSystem.claimReward(quest.id);
            expect(secondReward).toBe(0);
        });

        test('should handle multiple quests independently', () => {
            questSystem.generateDailyQuests();
            
            // Update progress for different types
            questSystem.updateProgress('merge', 5);
            questSystem.updateProgress('enhance', 3);
            questSystem.updateProgress('sell', 10);
            
            // Each quest should only track its own type
            questSystem.activeQuests.forEach(quest => {
                if (quest.objective.type === 'merge') {
                    expect(quest.objective.current).toBeGreaterThanOrEqual(5);
                } else if (quest.objective.type === 'enhance') {
                    expect(quest.objective.current).toBeGreaterThanOrEqual(3);
                } else if (quest.objective.type === 'sell') {
                    expect(quest.objective.current).toBeGreaterThanOrEqual(10);
                }
            });
        });

        test('should handle completing multiple quests', () => {
            questSystem.generateDailyQuests();
            
            // Complete all quests
            questSystem.activeQuests.forEach(quest => {
                questSystem.updateProgress(quest.objective.type, quest.objective.target);
            });
            
            // All should be completed
            questSystem.activeQuests.forEach(quest => {
                expect(quest.completed).toBe(true);
            });
            
            // Claim all rewards
            let totalRewards = 0;
            questSystem.activeQuests.forEach(quest => {
                totalRewards += questSystem.claimReward(quest.id);
            });
            
            // Total rewards should equal sum of all quest rewards
            const expectedTotal = questSystem.activeQuests.reduce((sum, q) => sum + q.reward, 0);
            expect(totalRewards).toBe(expectedTotal);
            
            // All should be claimed
            questSystem.activeQuests.forEach(quest => {
                expect(quest.claimed).toBe(true);
            });
        });
    });

    describe('Edge cases', () => {
        test('should handle updateProgress with 0 amount', () => {
            questSystem.generateDailyQuests();
            const quest = questSystem.activeQuests[0];
            const type = quest.objective.type;
            const initialProgress = quest.objective.current;
            
            questSystem.updateProgress(type, 0);
            
            expect(quest.objective.current).toBe(initialProgress);
        });

        test('should handle updateProgress with negative amount', () => {
            questSystem.generateDailyQuests();
            const quest = questSystem.activeQuests[0];
            const type = quest.objective.type;
            
            questSystem.updateProgress(type, 10);
            const progressBefore = quest.objective.current;
            
            questSystem.updateProgress(type, -5);
            
            // Progress should decrease
            expect(quest.objective.current).toBe(progressBefore - 5);
        });

        test('should handle very large progress updates', () => {
            questSystem.generateDailyQuests();
            const quest = questSystem.activeQuests[0];
            const type = quest.objective.type;
            
            questSystem.updateProgress(type, 1000000);
            
            expect(quest.objective.current).toBe(1000000);
            expect(quest.completed).toBe(true);
        });

        test('should handle empty activeQuests array', () => {
            questSystem.activeQuests = [];
            
            expect(() => {
                questSystem.updateProgress('merge', 5);
                questSystem.checkCompletion('any-id');
                questSystem.claimReward('any-id');
            }).not.toThrow();
        });
    });
});
