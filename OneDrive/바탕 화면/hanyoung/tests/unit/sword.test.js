/**
 * Unit tests for Sword data model
 * Requirement: 5.3 - Sword gold value calculation
 */

import { describe, test, expect } from '@jest/globals';
import { createSword } from '../../js/models/Sword.js';

describe('createSword', () => {
    test('should create a sword with all required properties', () => {
        const sword = createSword(1, 0);
        
        expect(sword).toHaveProperty('id');
        expect(sword).toHaveProperty('level');
        expect(sword).toHaveProperty('enhancement');
        expect(sword).toHaveProperty('goldValue');
    });
    
    test('should create a sword with correct level and enhancement', () => {
        const level = 5;
        const enhancement = 3;
        const sword = createSword(level, enhancement);
        
        expect(sword.level).toBe(level);
        expect(sword.enhancement).toBe(enhancement);
    });
    
    test('should default enhancement to 0 if not provided', () => {
        const sword = createSword(5);
        
        expect(sword.enhancement).toBe(0);
    });
    
    test('should generate unique IDs for different swords', () => {
        const sword1 = createSword(1, 0);
        const sword2 = createSword(1, 0);
        
        expect(sword1.id).not.toBe(sword2.id);
    });
    
    test('should calculate correct gold value for level 1, enhancement 0', () => {
        const sword = createSword(1, 0);
        
        // Base: 2^(1-1) * 10 = 10
        // Multiplier: 1 + (0 * 0.5) = 1
        // Result: floor(10 * 1) = 10
        expect(sword.goldValue).toBe(10);
    });
    
    test('should calculate correct gold value for level 5, enhancement 3', () => {
        const sword = createSword(5, 3);
        
        // Base: 2^(5-1) * 10 = 160
        // Multiplier: 1 + (3 * 0.5) = 2.5
        // Result: floor(160 * 2.5) = 400
        expect(sword.goldValue).toBe(400);
    });
    
    test('should calculate correct gold value for level 10, enhancement 0', () => {
        const sword = createSword(10, 0);
        
        // Base: 2^(10-1) * 10 = 5120
        // Multiplier: 1 + (0 * 0.5) = 1
        // Result: floor(5120 * 1) = 5120
        expect(sword.goldValue).toBe(5120);
    });
    
    test('should handle high enhancement levels correctly', () => {
        const sword = createSword(3, 10);
        
        // Base: 2^(3-1) * 10 = 40
        // Multiplier: 1 + (10 * 0.5) = 6
        // Result: floor(40 * 6) = 240
        expect(sword.goldValue).toBe(240);
    });
    
    test('should create swords with increasing gold value as enhancement increases', () => {
        const level = 5;
        const sword0 = createSword(level, 0);
        const sword1 = createSword(level, 1);
        const sword2 = createSword(level, 2);
        
        expect(sword1.goldValue).toBeGreaterThan(sword0.goldValue);
        expect(sword2.goldValue).toBeGreaterThan(sword1.goldValue);
    });
    
    test('should create swords with exponentially increasing gold value as level increases', () => {
        const enhancement = 0;
        const sword1 = createSword(1, enhancement);
        const sword2 = createSword(2, enhancement);
        const sword3 = createSword(3, enhancement);
        
        // Each level doubles the base value
        expect(sword2.goldValue).toBe(sword1.goldValue * 2);
        expect(sword3.goldValue).toBe(sword2.goldValue * 2);
    });
});
