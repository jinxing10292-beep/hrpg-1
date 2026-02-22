/**
 * Unit tests for utility functions
 */

import { describe, test, expect } from '@jest/globals';
import { generateUUID, calculateGoldValue } from '../../js/utils.js';

describe('generateUUID', () => {
    test('should generate a valid UUID format', () => {
        const uuid = generateUUID();
        
        // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(uuid).toMatch(uuidRegex);
    });
    
    test('should generate unique UUIDs', () => {
        const uuid1 = generateUUID();
        const uuid2 = generateUUID();
        
        expect(uuid1).not.toBe(uuid2);
    });
    
    test('should generate UUIDs of correct length', () => {
        const uuid = generateUUID();
        
        expect(uuid).toHaveLength(36); // 32 hex chars + 4 hyphens
    });
});

describe('calculateGoldValue', () => {
    test('should calculate correct value for level 1, enhancement 0', () => {
        // Base: 2^(1-1) * 10 = 1 * 10 = 10
        // Multiplier: 1 + (0 * 0.5) = 1
        // Result: floor(10 * 1) = 10
        expect(calculateGoldValue(1, 0)).toBe(10);
    });
    
    test('should calculate correct value for level 5, enhancement 3', () => {
        // Base: 2^(5-1) * 10 = 16 * 10 = 160
        // Multiplier: 1 + (3 * 0.5) = 2.5
        // Result: floor(160 * 2.5) = 400
        expect(calculateGoldValue(5, 3)).toBe(400);
    });
    
    test('should calculate correct value for level 10, enhancement 0', () => {
        // Base: 2^(10-1) * 10 = 512 * 10 = 5120
        // Multiplier: 1 + (0 * 0.5) = 1
        // Result: floor(5120 * 1) = 5120
        expect(calculateGoldValue(10, 0)).toBe(5120);
    });
    
    test('should handle high enhancement levels', () => {
        // Base: 2^(3-1) * 10 = 4 * 10 = 40
        // Multiplier: 1 + (10 * 0.5) = 6
        // Result: floor(40 * 6) = 240
        expect(calculateGoldValue(3, 10)).toBe(240);
    });
    
    test('should increase value with enhancement', () => {
        const level = 5;
        const value0 = calculateGoldValue(level, 0);
        const value1 = calculateGoldValue(level, 1);
        const value2 = calculateGoldValue(level, 2);
        
        expect(value1).toBeGreaterThan(value0);
        expect(value2).toBeGreaterThan(value1);
    });
    
    test('should increase value exponentially with level', () => {
        const enhancement = 0;
        const value1 = calculateGoldValue(1, enhancement);
        const value2 = calculateGoldValue(2, enhancement);
        const value3 = calculateGoldValue(3, enhancement);
        
        // Each level doubles the base value
        expect(value2).toBe(value1 * 2);
        expect(value3).toBe(value2 * 2);
    });
});
