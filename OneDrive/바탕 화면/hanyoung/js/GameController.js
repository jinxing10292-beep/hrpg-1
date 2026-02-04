/**
 * Game Controller - Coordinates all game systems and manages state
 * Requirements: 12.1, 12.4
 */

import { InventoryManager } from './systems/InventoryManager.js';
import { MergeSystem } from './systems/MergeSystem.js';
import { EnhancementSystem } from './systems/EnhancementSystem.js';
import { ShopSystem } from './systems/ShopSystem.js';
import { QuestSystem } from './systems/QuestSystem.js';
import { AchievementSystem } from './systems/AchievementSystem.js';
import { StorageManager } from './systems/StorageManager.js';
import { UIRenderer } from './ui/UIRenderer.js';
import { DragDropHandler } from './ui/DragDropHandler.js';

export class GameController {
    constructor() {
        // Initialize all subsystems
        this.inventory = new InventoryManager();
        this.mergeSystem = new MergeSystem();
        this.enhancementSystem = new EnhancementSystem();
        this.shopSystem = new ShopSystem();
        this.questSystem = new QuestSystem();
        this.achievementSystem = new AchievementSystem();
        this.storageManager = new StorageManager();
        this.uiRenderer = new UIRenderer();
        this.dragDropHandler = new DragDropHandler();

        // Game state
        this.gameState = null;
        this.autoSaveInterval = null;
    }

    /**
     * Initialize the game
     * Requirements: 12.1, 12.4
     * Loads saved state or creates new game, initializes all systems
     */
    init() {
        // Load game state from storage or create new
        this.loadGameState();

        // Initialize subsystems with loaded state
        this.initializeSubsystems();

        // Set up auto-save
        this.setupAutoSave();

        console.log('Game Controller initialized');
    }

    /**
     * Load game state from storage or create new
     * Requirements: 12.1
     */
    loadGameState() {
        // Try to load saved game
        const savedState = this.storageManager.loadGame();

        if (savedState) {
            // Use saved state
            this.gameState = savedState;
            console.log('Loaded saved game state');
        } else {
            // Create new game state
            this.gameState = this.storageManager.createNewGameState();
            console.log('Created new game state');
        }
    }

    /**
     * Initialize all subsystems with loaded game state
     * Requirements: 12.1
     * @private
     */
    initializeSubsystems() {
        // Initialize inventory with saved slots
        this.inventory.slots = this.gameState.inventory;

        // Initialize quest system with saved quests
        if (this.gameState.quests.length === 0) {
            // Generate daily quests if none exist
            this.gameState.quests = this.questSystem.generateDailyQuests();
        } else {
            this.questSystem.activeQuests = this.gameState.quests;
        }

        // Initialize achievement system with saved achievements
        if (this.gameState.achievements.length === 0) {
            // Initialize achievements if none exist
            this.gameState.achievements = this.achievementSystem.achievements;
        } else {
            this.achievementSystem.achievements = this.gameState.achievements;
        }
    }

    /**
     * Save current game state to storage
     * Requirements: 12.4
     */
    saveGameState() {
        // Update game state with current subsystem states
        this.gameState.inventory = this.inventory.slots;
        this.gameState.quests = this.questSystem.activeQuests;
        this.gameState.achievements = this.achievementSystem.achievements;
        this.gameState.lastSaved = new Date();

        // Save to storage
        const success = this.storageManager.saveGame(this.gameState);
        
        if (success) {
            console.log('Game state saved successfully');
        } else {
            console.error('Failed to save game state');
        }

        return success;
    }

    /**
     * Trigger auto-save after state changes
     * Requirements: 12.4
     * @private
     */
    triggerAutoSave() {
        this.saveGameState();
    }

    /**
     * Sell a sword and add gold
     * Requirements: 5.1, 5.2
     * @param {number} position - Inventory position
     * @returns {boolean} True if successful
     */
    sellSword(position) {
        // Get sword at position
        const sword = this.inventory.getSword(position);
        
        if (!sword) {
            console.error('No sword at position', position);
            return false;
        }

        // Add gold value to player
        this.gameState.player.gold += sword.goldValue;

        // Update statistics
        this.updateStats('totalSales', 1);
        this.updateStats('totalGoldEarned', sword.goldValue);

        // Remove sword from inventory
        this.inventory.removeSword(position);

        // Update quest progress
        this.questSystem.updateProgress('sell', 1);

        // Check achievements
        this.checkAchievements();

        // Trigger auto-save
        this.triggerAutoSave();

        return true;
    }

    /**
     * Sell all swords in inventory
     * Requirements: 9.2, 9.3
     * @returns {number} Total gold earned
     */
    sellAllSwords() {
        // Calculate total value
        const totalValue = this.inventory.getTotalValue();
        
        if (totalValue === 0) {
            return 0;
        }

        // Count swords for statistics
        const swordCount = this.inventory.countSwords();

        // Add gold to player
        this.gameState.player.gold += totalValue;

        // Update statistics
        this.updateStats('totalSales', swordCount);
        this.updateStats('totalGoldEarned', totalValue);

        // Clear inventory
        this.inventory.clear();

        // Update quest progress
        this.questSystem.updateProgress('sell', swordCount);

        // Check achievements
        this.checkAchievements();

        // Trigger auto-save
        this.triggerAutoSave();

        return totalValue;
    }

    /**
     * Handle merge operation
     * Requirements: 3.5
     * @param {number} sourcePos - Source position
     * @param {number} targetPos - Target position
     * @returns {boolean} True if successful
     */
    handleMerge(sourcePos, targetPos) {
        const sword1 = this.inventory.getSword(sourcePos);
        const sword2 = this.inventory.getSword(targetPos);

        if (!sword1 || !sword2) {
            return false;
        }

        if (!this.mergeSystem.canMerge(sword1, sword2)) {
            return false;
        }

        // Perform merge
        const mergedSword = this.mergeSystem.merge(sword1, sword2);

        // Remove both source swords
        this.inventory.removeSword(sourcePos);
        this.inventory.removeSword(targetPos);

        // Add merged sword to target position
        this.inventory.addSword(mergedSword, targetPos);

        // Update statistics
        this.updateStats('totalMerges', 1);
        if (mergedSword.level > this.gameState.stats.maxLevel) {
            this.gameState.stats.maxLevel = mergedSword.level;
        }

        // Update quest progress
        this.questSystem.updateProgress('merge', 1);

        // Check achievements
        this.checkAchievements();

        // Trigger auto-save
        this.triggerAutoSave();

        return true;
    }

    /**
     * Handle enhancement operation
     * Requirements: 4.1, 4.2, 4.3, 4.4
     * @param {number} position - Inventory position
     * @returns {Object} Enhancement result with outcome and sword (if not destroyed)
     */
    handleEnhancement(position) {
        const sword = this.inventory.getSword(position);

        if (!sword) {
            return { success: false, error: 'No sword at position' };
        }

        // Perform enhancement
        const result = this.enhancementSystem.enhance(sword);

        // Update statistics
        this.updateStats('totalEnhancements', 1);

        // Handle result
        if (result === 'SUCCESS') {
            // Sword was enhanced, update in inventory
            this.inventory.removeSword(position);
            this.inventory.addSword(sword, position);
        } else if (result === 'MAINTAIN') {
            // Sword unchanged, no action needed
        } else if (result === 'DESTROY') {
            // Remove sword from inventory
            this.inventory.removeSword(position);
        }

        // Update quest progress
        this.questSystem.updateProgress('enhance', 1);

        // Check achievements
        this.checkAchievements();

        // Trigger auto-save
        this.triggerAutoSave();

        return { success: true, result, sword: result !== 'DESTROY' ? sword : null };
    }

    /**
     * Handle purchase from shop
     * Requirements: 6.1, 6.2, 6.4
     * @param {string} itemType - 'basic' or 'luckybox'
     * @returns {Object} Purchase result
     */
    handlePurchase(itemType) {
        let result;

        if (itemType === 'basic') {
            result = this.shopSystem.purchaseBasicSword(this.gameState.player.gold, this.inventory);
        } else if (itemType === 'luckybox') {
            result = this.shopSystem.purchaseLuckyBox(this.gameState.player.gold, this.inventory);
        } else {
            return { success: false, error: 'Invalid item type' };
        }

        if (result.success) {
            // Deduct cost
            const cost = itemType === 'basic' ? 20 : 100;
            this.gameState.player.gold -= cost;

            // Update statistics
            this.updateStats('totalPurchases', 1);

            // Update quest progress
            this.questSystem.updateProgress('purchase', 1);

            // Check achievements
            this.checkAchievements();

            // Trigger auto-save
            this.triggerAutoSave();
        }

        return result;
    }

    /**
     * Handle quest claim
     * Requirements: 7.3
     * @param {string} questId - Quest ID to claim
     * @returns {Object} Claim result
     */
    handleQuestClaim(questId) {
        const reward = this.questSystem.claimReward(questId);

        if (reward > 0) {
            // Add reward gold
            this.gameState.player.gold += reward;

            // Trigger auto-save
            this.triggerAutoSave();

            return { success: true, reward };
        }

        return { success: false, error: 'Quest cannot be claimed' };
    }

    /**
     * Update player statistics
     * Requirements: 3.5, 7.5, 8.1
     * @param {string} statType - Type of stat to update
     * @param {number} value - Value to add/update
     */
    updateStats(statType, value) {
        if (!this.gameState.stats.hasOwnProperty(statType)) {
            console.error('Invalid stat type:', statType);
            return;
        }

        // For maxLevel, use max value
        if (statType === 'maxLevel') {
            this.gameState.stats[statType] = Math.max(this.gameState.stats[statType], value);
        } else {
            // For other stats, add value
            this.gameState.stats[statType] += value;
        }
    }

    /**
     * Check and unlock achievements
     * Requirements: 8.1, 8.2
     * @private
     */
    checkAchievements() {
        const unlockedAchievements = this.achievementSystem.checkAchievements(this.gameState.stats);
        
        // Notify about newly unlocked achievements
        if (unlockedAchievements.length > 0) {
            console.log('Achievements unlocked:', unlockedAchievements.map(a => a.title));
        }
    }

    /**
     * Set up auto-save interval
     * Requirements: 12.4
     */
    setupAutoSave() {
        // Clear existing interval if any
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        // Set up auto-save every 30 seconds
        this.autoSaveInterval = setInterval(() => {
            this.saveGameState();
        }, 30000);

        // Set up beforeunload handler for final save
        window.addEventListener('beforeunload', () => {
            this.saveGameState();
        });
    }

    /**
     * Attach event handlers for user actions
     * Requirements: 12.1
     * This will be fully implemented in task 17
     */
    attachEventHandlers() {
        // Placeholder for event handler attachment
        // Will be implemented in task 17
        console.log('Event handlers will be attached in task 17');
    }

    /**
     * Get current player gold
     * @returns {number} Current gold amount
     */
    getPlayerGold() {
        return this.gameState.player.gold;
    }

    /**
     * Get current game statistics
     * @returns {Object} Player statistics
     */
    getStats() {
        return this.gameState.stats;
    }

    /**
     * Get active quests
     * @returns {Array} Active quests
     */
    getQuests() {
        return this.questSystem.activeQuests;
    }

    /**
     * Get achievements
     * @returns {Array} All achievements
     */
    getAchievements() {
        return this.achievementSystem.achievements;
    }
}
