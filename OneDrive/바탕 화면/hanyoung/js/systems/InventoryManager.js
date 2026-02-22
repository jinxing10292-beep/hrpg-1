/**
 * Inventory Manager - Manages the 5x5 grid of sword slots
 * Requirements: 1.1, 1.3, 1.4, 2.3, 2.4, 9.1, 9.2
 */

export class InventoryManager {
    constructor() {
        // Initialize 25 slots (5x5 grid)
        this.slots = Array(25).fill(null).map((_, index) => ({
            position: index,
            sword: null
        }));
    }

    /**
     * Add a sword to the inventory
     * @param {Object} sword - The sword to add
     * @param {number} position - Optional specific position (0-24)
     * @returns {boolean} True if successful, false otherwise
     */
    addSword(sword, position = null) {
        // Validate sword properties
        if (!sword || sword.level < 1 || sword.enhancement < 0) {
            console.error('Invalid sword properties:', sword);
            return false;
        }

        // If position is specified, use it; otherwise find empty slot
        const targetPosition = position !== null ? position : this.findEmptySlot();
        
        if (targetPosition === null) {
            return false; // No empty slot available
        }

        // Validate position
        if (targetPosition < 0 || targetPosition >= 25) {
            console.error('Invalid inventory position:', targetPosition);
            return false;
        }

        // Check if target position is empty
        if (this.slots[targetPosition].sword !== null) {
            return false; // Position is occupied
        }

        // Add sword to the position
        this.slots[targetPosition].sword = sword;
        return true;
    }

    /**
     * Remove a sword from a specific position
     * @param {number} position - The position to remove from (0-24)
     * @returns {Object|null} The removed sword or null
     */
    removeSword(position) {
        // Validate position
        if (position < 0 || position >= 25) {
            console.error('Invalid inventory position:', position);
            return null;
        }

        const sword = this.slots[position].sword;
        this.slots[position].sword = null;
        return sword;
    }

    /**
     * Get the sword at a specific position
     * @param {number} position - The position to check (0-24)
     * @returns {Object|null} The sword at that position or null
     */
    getSword(position) {
        // Validate position
        if (position < 0 || position >= 25) {
            console.error('Invalid inventory position:', position);
            return null;
        }

        return this.slots[position].sword;
    }

    /**
     * Find the first empty slot
     * @returns {number|null} The position of the first empty slot or null if full
     */
    findEmptySlot() {
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i].sword === null) {
                return i;
            }
        }
        return null;
    }

    /**
     * Check if the inventory is full
     * @returns {boolean} True if all 25 slots are occupied
     */
    isFull() {
        return this.findEmptySlot() === null;
    }

    /**
     * Move a sword from one position to another (empty slot)
     * @param {number} fromPos - Source position
     * @param {number} toPos - Target position (must be empty)
     * @returns {boolean} True if successful
     */
    moveSword(fromPos, toPos) {
        // Validate positions
        if (fromPos < 0 || fromPos >= 25 || toPos < 0 || toPos >= 25) {
            console.error('Invalid inventory positions:', fromPos, toPos);
            return false;
        }

        // Check if source has a sword
        const sword = this.slots[fromPos].sword;
        if (sword === null) {
            console.error('No sword at source position:', fromPos);
            return false;
        }

        // Check if target is empty
        if (this.slots[toPos].sword !== null) {
            console.error('Target position is not empty:', toPos);
            return false;
        }

        // Move the sword
        this.slots[toPos].sword = sword;
        this.slots[fromPos].sword = null;
        return true;
    }

    /**
     * Swap two swords at different positions
     * @param {number} pos1 - First position
     * @param {number} pos2 - Second position
     * @returns {boolean} True if successful
     */
    swapSwords(pos1, pos2) {
        // Validate positions
        if (pos1 < 0 || pos1 >= 25 || pos2 < 0 || pos2 >= 25) {
            console.error('Invalid inventory positions:', pos1, pos2);
            return false;
        }

        // Check if positions are different
        if (pos1 === pos2) {
            console.error('Cannot swap sword with itself');
            return false;
        }

        // Check if both positions have swords
        const sword1 = this.slots[pos1].sword;
        const sword2 = this.slots[pos2].sword;
        
        if (sword1 === null || sword2 === null) {
            console.error('Both positions must have swords to swap');
            return false;
        }

        // Swap the swords
        this.slots[pos1].sword = sword2;
        this.slots[pos2].sword = sword1;
        return true;
    }

    /**
     * Get all swords in the inventory
     * @returns {Array} Array of all swords (excluding nulls)
     */
    getAllSwords() {
        return this.slots
            .map(slot => slot.sword)
            .filter(sword => sword !== null);
    }

    /**
     * Get the total gold value of all swords
     * @returns {number} Sum of all sword gold values
     */
    getTotalValue() {
        return this.getAllSwords()
            .reduce((total, sword) => total + sword.goldValue, 0);
    }

    /**
     * Count the number of swords in inventory
     * @returns {number} Number of swords
     */
    countSwords() {
        return this.getAllSwords().length;
    }

    /**
     * Sort inventory by level in descending order
     * Swords are arranged from highest to lowest level, with empty slots at the end
     * Requirements: 9.1, 9.5
     */
    sortByLevel() {
        // Get all swords with their current positions
        const swords = this.getAllSwords();
        
        // Sort swords by level in descending order (highest first)
        swords.sort((a, b) => b.level - a.level);
        
        // Clear all slots
        this.slots.forEach(slot => {
            slot.sword = null;
        });
        
        // Place sorted swords back into inventory starting from position 0
        swords.forEach((sword, index) => {
            this.slots[index].sword = sword;
        });
    }

    /**
     * Clear all swords from inventory
     * Requirements: 9.2
     */
    clear() {
        this.slots.forEach(slot => {
            slot.sword = null;
        });
    }
}
