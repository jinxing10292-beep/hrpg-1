/**
 * Unit tests for MergeSystem
 * Requirements: 3.1, 3.3, 3.4
 */

import { describe, test, expect } from '@jest/globals';
import { MergeSystem } from '../../js/systems/MergeSystem.js';
import { createSword } from '../../js/models/Sword.js';

describe('MergeSystem', () => {
    let mergeSystem;

    beforeEach(() => {
        mergeSystem = new MergeSystem();
    });

    describe('canMerge', () => {
        test('should return true for two swords with the same level', () => {
            const sword1 = createSword(5, 2);
            const sword2 = createSword(5, 3);
            
            expect(mergeSystem.canMerge(sword1, sword2)).toBe(true);
        });

        test('should return false for two swords with different levels', () => {
            const sword1 = createSword(5, 0);
            const sword2 = createSword(6, 0);
            
            expect(mergeSystem.canMerge(sword1, sword2)).toBe(false);
        });

        test('should return false when first sword is null', () => {
            const sword2 = createSword(5, 0);
            
            expect(mergeSystem.canMerge(null, sword2)).toBe(false);
        });

        test('should return false when second sword is null', () => {
            const sword1 = createSword(5, 0);
            
            expect(mergeSystem.canMerge(sword1, null)).toBe(false);
        });

        test('should return false when both swords are null', () => {
            expect(mergeSystem.canMerge(null, null)).toBe(false);
        });

        test('should return false when first sword is undefined', () => {
            const sword2 = createSword(5, 0);
            
            expect(mergeSystem.canMerge(undefined, sword2)).toBe(false);
        });

        test('should return true for level 1 swords', () => {
            const sword1 = createSword(1, 0);
            const sword2 = createSword(1, 0);
            
            expect(mergeSystem.canMerge(sword1, sword2)).toBe(true);
        });

        test('should return true for high-level swords with same level', () => {
            const sword1 = createSword(20, 5);
            const sword2 = createSword(20, 10);
            
            expect(mergeSystem.canMerge(sword1, sword2)).toBe(true);
        });

        test('should ignore enhancement levels when checking merge compatibility', () => {
            const sword1 = createSword(5, 0);
            const sword2 = createSword(5, 10);
            
            expect(mergeSystem.canMerge(sword1, sword2)).toBe(true);
        });
    });

    describe('merge', () => {
        test('should create a sword with level incremented by one', () => {
            const sword1 = createSword(5, 2);
            const sword2 = createSword(5, 3);
            
            const result = mergeSystem.merge(sword1, sword2);
            
            expect(result.level).toBe(6);
        });

        test('should create a sword with enhancement level reset to zero', () => {
            const sword1 = createSword(5, 5);
            const sword2 = createSword(5, 10);
            
            const result = mergeSystem.merge(sword1, sword2);
            
            expect(result.enhancement).toBe(0);
        });

        test('should create a sword with correct gold value for new level', () => {
            const sword1 = createSword(5, 0);
            const sword2 = createSword(5, 0);
            
            const result = mergeSystem.merge(sword1, sword2);
            
            // Level 6, enhancement 0: 2^(6-1) * 10 * 1 = 320
            expect(result.goldValue).toBe(320);
        });

        test('should create a sword with unique ID', () => {
            const sword1 = createSword(5, 0);
            const sword2 = createSword(5, 0);
            
            const result = mergeSystem.merge(sword1, sword2);
            
            expect(result.id).toBeDefined();
            expect(result.id).not.toBe(sword1.id);
            expect(result.id).not.toBe(sword2.id);
        });

        test('should throw error when merging swords with different levels', () => {
            const sword1 = createSword(5, 0);
            const sword2 = createSword(6, 0);
            
            expect(() => {
                mergeSystem.merge(sword1, sword2);
            }).toThrow('Cannot merge swords with different levels');
        });

        test('should throw error when first sword is null', () => {
            const sword2 = createSword(5, 0);
            
            expect(() => {
                mergeSystem.merge(null, sword2);
            }).toThrow('Cannot merge swords with different levels');
        });

        test('should throw error when second sword is null', () => {
            const sword1 = createSword(5, 0);
            
            expect(() => {
                mergeSystem.merge(sword1, null);
            }).toThrow('Cannot merge swords with different levels');
        });

        test('should merge level 1 swords to create level 2 sword', () => {
            const sword1 = createSword(1, 0);
            const sword2 = createSword(1, 0);
            
            const result = mergeSystem.merge(sword1, sword2);
            
            expect(result.level).toBe(2);
            expect(result.enhancement).toBe(0);
            expect(result.goldValue).toBe(20); // 2^(2-1) * 10 = 20
        });

        test('should merge high-level swords correctly', () => {
            const sword1 = createSword(15, 5);
            const sword2 = createSword(15, 8);
            
            const result = mergeSystem.merge(sword1, sword2);
            
            expect(result.level).toBe(16);
            expect(result.enhancement).toBe(0);
            // 2^(16-1) * 10 = 327680
            expect(result.goldValue).toBe(327680);
        });

        test('should create different swords on multiple merges', () => {
            const sword1 = createSword(5, 0);
            const sword2 = createSword(5, 0);
            const sword3 = createSword(5, 0);
            const sword4 = createSword(5, 0);
            
            const result1 = mergeSystem.merge(sword1, sword2);
            const result2 = mergeSystem.merge(sword3, sword4);
            
            expect(result1.id).not.toBe(result2.id);
            expect(result1.level).toBe(result2.level);
            expect(result1.enhancement).toBe(result2.enhancement);
        });

        test('should always reset enhancement to 0 regardless of source enhancement levels', () => {
            const testCases = [
                [0, 0],
                [5, 5],
                [10, 0],
                [0, 10],
                [3, 7]
            ];

            testCases.forEach(([enh1, enh2]) => {
                const sword1 = createSword(5, enh1);
                const sword2 = createSword(5, enh2);
                
                const result = mergeSystem.merge(sword1, sword2);
                
                expect(result.enhancement).toBe(0);
            });
        });
    });
});
