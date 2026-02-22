/**
 * Sword data model and factory functions
 * Requirement: 5.3 - Sword gold value calculation
 */

import { generateUUID, calculateGoldValue } from '../utils.js';

/**
 * Create a new Sword object
 * @param {number} level - The base level of the sword (1-N)
 * @param {number} enhancement - The enhancement level (0-N)
 * @returns {Object} Sword object with id, level, enhancement, and goldValue
 */
export function createSword(level, enhancement = 0) {
    return {
        id: generateUUID(),
        level: level,
        enhancement: enhancement,
        goldValue: calculateGoldValue(level, enhancement)
    };
}
