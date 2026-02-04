/**
 * Merge System - Handles sword merging logic
 * Requirements: 3.1, 3.3, 3.4
 */

import { createSword } from '../models/Sword.js';

export class MergeSystem {
    /**
     * Check if two swords can be merged
     * @param {Object} sword1 - First sword
     * @param {Object} sword2 - Second sword
     * @returns {boolean} True if swords can be merged
     */
    canMerge(sword1, sword2) {
        // Requirement 3.4: Merge operation only executes when both swords have exactly the same base level
        if (!sword1 || !sword2) {
            return false;
        }
        return sword1.level === sword2.level;
    }

    /**
     * Merge two swords into one higher-level sword
     * @param {Object} sword1 - First sword
     * @param {Object} sword2 - Second sword
     * @returns {Object} The merged sword
     */
    merge(sword1, sword2) {
        // Validate merge is possible
        if (!this.canMerge(sword1, sword2)) {
            throw new Error('Cannot merge swords with different levels');
        }

        // Requirement 3.1: Create one sword with level incremented by one
        // Requirement 3.3: New sword has enhancement level reset to zero
        const newLevel = sword1.level + 1;
        return createSword(newLevel, 0);
    }
}
