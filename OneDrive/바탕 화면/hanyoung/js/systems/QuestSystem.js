/**
 * Quest System - Manages daily quests and objectives
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import { generateUUID } from '../utils.js';

/**
 * @typedef {Object} QuestObjective
 * @property {string} type - Quest type: 'merge', 'enhance', 'sell', or 'purchase'
 * @property {number} target - Target amount to complete the quest
 * @property {number} current - Current progress toward the target
 */

/**
 * @typedef {Object} Quest
 * @property {string} id - Unique identifier for the quest
 * @property {string} title - Display title of the quest
 * @property {string} description - Description of what the quest requires
 * @property {QuestObjective} objective - The quest objective with progress tracking
 * @property {number} reward - Gold reward for completing the quest
 * @property {boolean} completed - Whether the quest objective has been met
 * @property {boolean} claimed - Whether the quest reward has been claimed
 */

export class QuestSystem {
    constructor() {
        this.activeQuests = [];
    }

    /**
     * Generate daily quests with random selection
     * @returns {Quest[]} Array of 3 randomly selected Quest objects
     */
    generateDailyQuests() {
        const templates = [
            { type: 'merge', target: 10, reward: 100, title: 'Merge Master', description: 'Merge 10 swords' },
            { type: 'merge', target: 25, reward: 250, title: 'Merge Expert', description: 'Merge 25 swords' },
            { type: 'enhance', target: 5, reward: 150, title: 'Enhancement Novice', description: 'Enhance 5 swords' },
            { type: 'enhance', target: 10, reward: 300, title: 'Enhancement Expert', description: 'Enhance 10 swords' },
            { type: 'sell', target: 20, reward: 80, title: 'Merchant', description: 'Sell 20 swords' },
            { type: 'sell', target: 50, reward: 200, title: 'Master Merchant', description: 'Sell 50 swords' },
            { type: 'purchase', target: 15, reward: 120, title: 'Collector', description: 'Purchase 15 items' },
            { type: 'purchase', target: 30, reward: 280, title: 'Master Collector', description: 'Purchase 30 items' }
        ];

        // Select 3 random quests
        const selectedQuests = this.selectRandomQuests(templates, 3);
        
        // Create Quest objects from templates
        this.activeQuests = selectedQuests.map(template => ({
            id: generateUUID(),
            title: template.title,
            description: template.description,
            objective: {
                type: template.type,
                target: template.target,
                current: 0
            },
            reward: template.reward,
            completed: false,
            claimed: false
        }));

        return this.activeQuests;
    }

    /**
     * Select random quests from templates without duplicates
     * @private
     * @param {Array} templates - Array of quest templates
     * @param {number} count - Number of quests to select
     * @returns {Array} Array of selected quest templates
     */
    selectRandomQuests(templates, count) {
        const shuffled = [...templates].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    /**
     * Update progress for quests of a specific type
     * @param {string} type - Quest type (merge, enhance, sell, purchase)
     * @param {number} amount - Amount to increment by (default: 1)
     */
    updateProgress(type, amount = 1) {
        this.activeQuests.forEach(quest => {
            if (quest.objective.type === type && !quest.claimed) {
                quest.objective.current += amount;
                
                // Check if quest is now completed
                if (this.isObjectiveMet(quest.objective)) {
                    quest.completed = true;
                }
            }
        });
    }

    /**
     * Check if a quest objective is met
     * @private
     * @param {QuestObjective} objective - The quest objective to check
     * @returns {boolean} True if current >= target
     */
    isObjectiveMet(objective) {
        return objective.current >= objective.target;
    }

    /**
     * Check if a quest is completed
     * @param {string} questId - The quest ID to check
     * @returns {boolean} True if quest objective is met
     */
    checkCompletion(questId) {
        const quest = this.activeQuests.find(q => q.id === questId);
        if (!quest) {
            return false;
        }
        return this.isObjectiveMet(quest.objective);
    }

    /**
     * Claim a quest reward
     * @param {string} questId - The quest ID to claim
     * @returns {number} The reward amount (0 if cannot claim)
     */
    claimReward(questId) {
        const quest = this.activeQuests.find(q => q.id === questId);
        
        // Cannot claim if quest doesn't exist
        if (!quest) {
            return 0;
        }
        
        // Cannot claim if already claimed
        if (quest.claimed) {
            return 0;
        }
        
        // Cannot claim if not completed
        if (!quest.completed) {
            return 0;
        }
        
        // Mark as claimed and return reward
        quest.claimed = true;
        return quest.reward;
    }
}
