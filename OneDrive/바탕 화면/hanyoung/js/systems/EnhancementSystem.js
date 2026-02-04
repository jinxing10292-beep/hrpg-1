/**
 * Enhancement System - Handles probability-based sword enhancement
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */

/**
 * Enhancement result enum
 */
export const EnhancementResult = {
    SUCCESS: 'SUCCESS',
    MAINTAIN: 'MAINTAIN',
    DESTROY: 'DESTROY'
};

export class EnhancementSystem {
    /**
     * Get enhancement configuration (probabilities) for a given enhancement level
     * @param {number} enhancement - Current enhancement level
     * @returns {Object} Configuration with successRate, maintainRate, destroyRate
     */
    getEnhancementConfig(enhancement) {
        // Success rate decreases as enhancement increases
        // Formula: max(0.3, 0.9 - (enhancement * 0.1))
        const successRate = Math.max(0.3, 0.9 - (enhancement * 0.1));
        
        // Destroy rate increases as enhancement increases
        // Formula: min(0.5, enhancement * 0.1)
        const destroyRate = Math.min(0.5, enhancement * 0.1);
        
        // Maintain rate is the remainder
        const maintainRate = 1 - successRate - destroyRate;
        
        return {
            successRate,
            maintainRate,
            destroyRate
        };
    }

    /**
     * Attempt to enhance a sword
     * @param {Object} sword - The sword to enhance
     * @returns {string} EnhancementResult (SUCCESS, MAINTAIN, or DESTROY)
     */
    enhance(sword) {
        const config = this.getEnhancementConfig(sword.enhancement);
        return this.rollEnhancement(config);
    }

    /**
     * Execute enhancement with random outcome based on probabilities
     * @private
     * @param {Object} config - Enhancement configuration with probabilities
     * @returns {string} EnhancementResult (SUCCESS, MAINTAIN, or DESTROY)
     */
    rollEnhancement(config) {
        const roll = Math.random();
        
        if (roll < config.successRate) {
            return EnhancementResult.SUCCESS;
        }
        
        if (roll < config.successRate + config.maintainRate) {
            return EnhancementResult.MAINTAIN;
        }
        
        return EnhancementResult.DESTROY;
    }
}
