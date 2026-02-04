/**
 * Shop System - Handles purchasing swords and lucky boxes
 * Requirements: 6.1, 6.2, 6.4
 */

import { createSword } from '../models/Sword.js';

export class ShopSystem {
    constructor() {
        this.BASIC_SWORD_COST = 20;
        this.LUCKY_BOX_COST = 100;
    }

    /**
     * Purchase a basic level 1 sword
     * @param {number} playerGold - Current player gold
     * @param {Object} inventory - InventoryManager instance
     * @returns {Object} PurchaseResult with success, sword, and error
     */
    purchaseBasicSword(playerGold, inventory) {
        // Check if player has enough gold
        if (playerGold < this.BASIC_SWORD_COST) {
            return {
                success: false,
                error: `Insufficient gold. Need ${this.BASIC_SWORD_COST}, have ${playerGold}`
            };
        }

        // Check if inventory has space
        if (inventory.isFull()) {
            return {
                success: false,
                error: 'Inventory is full. Sell or merge swords to make space.'
            };
        }

        // Create a basic level 1 sword
        const sword = createSword(1, 0);

        // Add sword to inventory
        const added = inventory.addSword(sword);
        if (!added) {
            return {
                success: false,
                error: 'Failed to add sword to inventory'
            };
        }

        return {
            success: true,
            sword: sword
        };
    }

    /**
     * Purchase a lucky box (random level 1-5 sword)
     * @param {number} playerGold - Current player gold
     * @param {Object} inventory - InventoryManager instance
     * @returns {Object} PurchaseResult with success, sword, and error
     */
    purchaseLuckyBox(playerGold, inventory) {
        // Check if player has enough gold
        if (playerGold < this.LUCKY_BOX_COST) {
            return {
                success: false,
                error: `Insufficient gold. Need ${this.LUCKY_BOX_COST}, have ${playerGold}`
            };
        }

        // Check if inventory has space
        if (inventory.isFull()) {
            return {
                success: false,
                error: 'Inventory is full. Sell or merge swords to make space.'
            };
        }

        // Create a random level sword (1-5)
        const level = this.rollLuckyBoxLevel();
        const sword = createSword(level, 0);

        // Add sword to inventory
        const added = inventory.addSword(sword);
        if (!added) {
            return {
                success: false,
                error: 'Failed to add sword to inventory'
            };
        }

        return {
            success: true,
            sword: sword
        };
    }

    /**
     * Roll a random level for lucky box with weighted probability
     * 50% level 1, 25% level 2, 15% level 3, 7% level 4, 3% level 5
     * @returns {number} Sword level (1-5)
     */
    rollLuckyBoxLevel() {
        const roll = Math.random();
        if (roll < 0.50) return 1;
        if (roll < 0.75) return 2;
        if (roll < 0.90) return 3;
        if (roll < 0.97) return 4;
        return 5;
    }
}
