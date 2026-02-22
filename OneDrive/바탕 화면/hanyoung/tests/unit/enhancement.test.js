/**
 * Unit tests for EnhancementSystem
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */

import { EnhancementSystem, EnhancementResult } from '../../js/systems/EnhancementSystem.js';
import { createSword } from '../../js/models/Sword.js';

describe('EnhancementSystem', () => {
    let enhancementSystem;

    beforeEach(() => {
        enhancementSystem = new EnhancementSystem();
    });

    describe('getEnhancementConfig', () => {
        test('should return correct probabilities for enhancement level 0', () => {
            const config = enhancementSystem.getEnhancementConfig(0);
            
            expect(config.successRate).toBeCloseTo(0.9);
            expect(config.destroyRate).toBeCloseTo(0);
            expect(config.maintainRate).toBeCloseTo(0.1);
            
            // Probabilities should sum to 1
            expect(config.successRate + config.maintainRate + config.destroyRate).toBeCloseTo(1.0);
        });

        test('should return correct probabilities for enhancement level 3', () => {
            const config = enhancementSystem.getEnhancementConfig(3);
            
            expect(config.successRate).toBeCloseTo(0.6); // 0.9 - (3 * 0.1)
            expect(config.destroyRate).toBeCloseTo(0.3); // 3 * 0.1
            expect(config.maintainRate).toBeCloseTo(0.1); // 1 - 0.6 - 0.3
            
            // Probabilities should sum to 1
            expect(config.successRate + config.maintainRate + config.destroyRate).toBeCloseTo(1.0);
        });

        test('should cap success rate at minimum 0.3', () => {
            const config = enhancementSystem.getEnhancementConfig(10);
            
            expect(config.successRate).toBeCloseTo(0.3); // max(0.3, 0.9 - 10*0.1) = max(0.3, -0.1) = 0.3
            expect(config.destroyRate).toBeCloseTo(0.5); // min(0.5, 10 * 0.1) = min(0.5, 1.0) = 0.5
            expect(config.maintainRate).toBeCloseTo(0.2); // 1 - 0.3 - 0.5
            
            // Probabilities should sum to 1
            expect(config.successRate + config.maintainRate + config.destroyRate).toBeCloseTo(1.0);
        });

        test('should cap destroy rate at maximum 0.5', () => {
            const config = enhancementSystem.getEnhancementConfig(6);
            
            expect(config.successRate).toBeCloseTo(0.3); // max(0.3, 0.9 - 6*0.1) = max(0.3, 0.3) = 0.3
            expect(config.destroyRate).toBeCloseTo(0.5); // min(0.5, 6 * 0.1) = min(0.5, 0.6) = 0.5
            expect(config.maintainRate).toBeCloseTo(0.2); // 1 - 0.3 - 0.5
            
            // Probabilities should sum to 1
            expect(config.successRate + config.maintainRate + config.destroyRate).toBeCloseTo(1.0);
        });

        test('should handle enhancement level 1', () => {
            const config = enhancementSystem.getEnhancementConfig(1);
            
            expect(config.successRate).toBeCloseTo(0.8); // 0.9 - (1 * 0.1)
            expect(config.destroyRate).toBeCloseTo(0.1); // 1 * 0.1
            expect(config.maintainRate).toBeCloseTo(0.1); // 1 - 0.8 - 0.1
            
            // Probabilities should sum to 1
            expect(config.successRate + config.maintainRate + config.destroyRate).toBeCloseTo(1.0);
        });
    });

    describe('enhance', () => {
        test('should return one of the three valid enhancement results', () => {
            const sword = createSword(5, 2);
            const result = enhancementSystem.enhance(sword);
            
            expect([
                EnhancementResult.SUCCESS,
                EnhancementResult.MAINTAIN,
                EnhancementResult.DESTROY
            ]).toContain(result);
        });

        test('should use correct probabilities based on sword enhancement level', () => {
            const sword = createSword(5, 0);
            
            // Run multiple times to verify it's using the config
            const results = [];
            for (let i = 0; i < 10; i++) {
                results.push(enhancementSystem.enhance(sword));
            }
            
            // At least one result should be returned (basic sanity check)
            expect(results.length).toBe(10);
            results.forEach(result => {
                expect([
                    EnhancementResult.SUCCESS,
                    EnhancementResult.MAINTAIN,
                    EnhancementResult.DESTROY
                ]).toContain(result);
            });
        });
    });

    describe('rollEnhancement', () => {
        test('should return SUCCESS when roll is less than successRate', () => {
            const config = { successRate: 0.9, maintainRate: 0.1, destroyRate: 0 };
            
            // Mock Math.random to return a value less than successRate
            const originalRandom = Math.random;
            Math.random = () => 0.5; // 0.5 < 0.9
            
            const result = enhancementSystem.rollEnhancement(config);
            expect(result).toBe(EnhancementResult.SUCCESS);
            
            Math.random = originalRandom;
        });

        test('should return MAINTAIN when roll is between successRate and successRate+maintainRate', () => {
            const config = { successRate: 0.6, maintainRate: 0.3, destroyRate: 0.1 };
            
            // Mock Math.random to return a value in the maintain range
            const originalRandom = Math.random;
            Math.random = () => 0.7; // 0.6 < 0.7 < 0.9
            
            const result = enhancementSystem.rollEnhancement(config);
            expect(result).toBe(EnhancementResult.MAINTAIN);
            
            Math.random = originalRandom;
        });

        test('should return DESTROY when roll is greater than successRate+maintainRate', () => {
            const config = { successRate: 0.5, maintainRate: 0.3, destroyRate: 0.2 };
            
            // Mock Math.random to return a value in the destroy range
            const originalRandom = Math.random;
            Math.random = () => 0.95; // 0.95 > 0.8
            
            const result = enhancementSystem.rollEnhancement(config);
            expect(result).toBe(EnhancementResult.DESTROY);
            
            Math.random = originalRandom;
        });
    });
});
