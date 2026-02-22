/**
 * Utility functions for the Sword Merge Game
 */

/**
 * Generate a UUID v4 string
 * @returns {string} A unique identifier
 */
export function generateUUID() {
    // Use crypto.randomUUID if available (modern browsers)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    
    // Fallback implementation for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Calculate the gold value of a sword based on level and enhancement
 * Formula: floor((2^(L-1) * 10) * (1 + E * 0.5))
 * @param {number} level - The base level of the sword (1-N)
 * @param {number} enhancement - The enhancement level (0-N)
 * @returns {number} The calculated gold value
 */
export function calculateGoldValue(level, enhancement) {
    const baseValue = Math.pow(2, level - 1) * 10;
    const enhancementMultiplier = 1 + (enhancement * 0.5);
    return Math.floor(baseValue * enhancementMultiplier);
}
