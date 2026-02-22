/**
 * Storage Manager - Handles game state persistence with localStorage
 * Requirements: 10.2, 10.3, 10.4, 12.2, 12.3
 * 
 * @typedef {Object} GameState
 * @property {string} version - Game version
 * @property {PlayerState} player - Player state
 * @property {Array<InventorySlot>} inventory - 25 inventory slots
 * @property {Array<Quest>} quests - Active quests
 * @property {Array<Achievement>} achievements - All achievements
 * @property {PlayerStats} stats - Player statistics
 * @property {Date} lastSaved - Last save timestamp
 * 
 * @typedef {Object} PlayerState
 * @property {number} gold - Player's gold amount
 * 
 * @typedef {Object} PlayerStats
 * @property {number} totalMerges - Total merge operations
 * @property {number} totalEnhancements - Total enhancement attempts
 * @property {number} totalPurchases - Total purchases made
 * @property {number} totalSales - Total sales made
 * @property {number} maxLevel - Highest sword level achieved
 * @property {number} totalGoldEarned - Total gold earned
 */

export class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'sword_merge_game_save';
        this.CURRENT_VERSION = '1.0.0';
    }

    /**
     * Save game state to localStorage with JSON serialization
     * Requirements: 10.2
     * @param {GameState} state - GameState object
     * @returns {boolean} True if save successful
     */
    saveGame(state) {
        try {
            const serialized = this.serialize(state);
            localStorage.setItem(this.STORAGE_KEY, serialized);
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('Storage quota exceeded. Cannot save game.');
            } else {
                console.error('Failed to save game:', error);
            }
            return false;
        }
    }

    /**
     * Load game state from localStorage with deserialization and validation
     * Requirements: 10.3, 10.4, 12.2, 12.3
     * @returns {GameState|null} GameState object or null if no valid save exists
     */
    loadGame() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) {
                return null;
            }
            
            const state = this.deserialize(data);
            return state;
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    }

    /**
     * Clear saved game data from localStorage
     */
    clearSave() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear save:', error);
        }
    }

    /**
     * Serialize game state to JSON string
     * @private
     * @param {GameState} state - GameState object
     * @returns {string} JSON string
     */
    serialize(state) {
        return JSON.stringify(state);
    }

    /**
     * Deserialize and validate game state from JSON string
     * Requirements: 10.3, 12.2, 12.3
     * @private
     * @param {string} data - JSON string
     * @returns {GameState|null} GameState object or null if invalid
     */
    deserialize(data) {
        try {
            const state = JSON.parse(data);
            return this.validateState(state) ? state : null;
        } catch (error) {
            console.error('Failed to deserialize game state:', error);
            return null;
        }
    }

    /**
     * Validate loaded state structure for integrity
     * Requirements: 12.2, 12.3
     * @param {any} state - State object to validate
     * @returns {boolean} True if state is valid
     */
    validateState(state) {
        // Check basic structure
        if (!state || typeof state !== 'object') {
            return false;
        }

        // Validate version
        if (typeof state.version !== 'string') {
            return false;
        }

        // Validate player state
        if (!state.player || typeof state.player !== 'object') {
            return false;
        }
        if (typeof state.player.gold !== 'number') {
            return false;
        }

        // Validate inventory
        if (!Array.isArray(state.inventory)) {
            return false;
        }
        if (state.inventory.length !== 25) {
            return false;
        }

        // Validate each inventory slot
        for (let i = 0; i < state.inventory.length; i++) {
            const slot = state.inventory[i];
            if (!slot || typeof slot !== 'object') {
                return false;
            }
            if (typeof slot.position !== 'number') {
                return false;
            }
            // Sword can be null or an object
            if (slot.sword !== null) {
                if (typeof slot.sword !== 'object') {
                    return false;
                }
                // Validate sword properties if present
                if (typeof slot.sword.id !== 'string' ||
                    typeof slot.sword.level !== 'number' ||
                    typeof slot.sword.enhancement !== 'number' ||
                    typeof slot.sword.goldValue !== 'number') {
                    return false;
                }
            }
        }

        // Validate quests array
        if (!Array.isArray(state.quests)) {
            return false;
        }

        // Validate achievements array
        if (!Array.isArray(state.achievements)) {
            return false;
        }

        // Validate stats
        if (!state.stats || typeof state.stats !== 'object') {
            return false;
        }
        const requiredStats = ['totalMerges', 'totalEnhancements', 'totalPurchases', 
                               'totalSales', 'maxLevel', 'totalGoldEarned'];
        for (const stat of requiredStats) {
            if (typeof state.stats[stat] !== 'number') {
                return false;
            }
        }

        return true;
    }

    /**
     * Create a fresh game state for new games
     * Requirements: 10.4, 12.3
     * @returns {GameState} New GameState object
     */
    createNewGameState() {
        return {
            version: this.CURRENT_VERSION,
            player: { gold: 100 },
            inventory: Array(25).fill(null).map((_, i) => ({ position: i, sword: null })),
            quests: [],
            achievements: [],
            stats: {
                totalMerges: 0,
                totalEnhancements: 0,
                totalPurchases: 0,
                totalSales: 0,
                maxLevel: 0,
                totalGoldEarned: 0
            },
            lastSaved: new Date()
        };
    }
}
