/**
 * Main entry point for the Sword Merge Game
 */

import { GameController } from './GameController.js';

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sword Merge Game starting...');
    
    // Create and initialize the game controller
    const game = new GameController();
    game.init();
    
    // Make game controller available globally for debugging
    window.game = game;
});
