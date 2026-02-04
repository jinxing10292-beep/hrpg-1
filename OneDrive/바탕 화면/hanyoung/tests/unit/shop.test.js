/**
 * Unit tests for ShopSystem
 * Tests for task 7.1: Create ShopSystem class
 */

import { ShopSystem } from '../../js/systems/ShopSystem.js';
import { InventoryManager } from '../../js/systems/InventoryManager.js';

describe('ShopSystem - Task 7.1', () => {
    let shop;
    let inventory;

    beforeEach(() => {
        shop = new ShopSystem();
        inventory = new InventoryManager();
    });

    describe('Constants', () => {
        test('should have BASIC_SWORD_COST = 20', () => {
            expect(shop.BASIC_SWORD_COST).toBe(20);
        });

        test('should have LUCKY_BOX_COST = 100', () => {
            expect(shop.LUCKY_BOX_COST).toBe(100);
        });
    });

    describe('purchaseBasicSword()', () => {
        test('should successfully purchase basic sword with sufficient gold', () => {
            const result = shop.purchaseBasicSword(100, inventory);
            
            expect(result.success).toBe(true);
            expect(result.sword).toBeDefined();
            expect(result.sword.level).toBe(1);
            expect(result.sword.enhancement).toBe(0);
            expect(result.error).toBeUndefined();
        });

        test('should add sword to inventory', () => {
            const result = shop.purchaseBasicSword(100, inventory);
            
            expect(inventory.countSwords()).toBe(1);
            expect(inventory.getSword(0)).toBe(result.sword);
        });

        test('should fail with insufficient gold', () => {
            const result = shop.purchaseBasicSword(10, inventory);
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('Insufficient gold');
            expect(result.sword).toBeUndefined();
            expect(inventory.countSwords()).toBe(0);
        });

        test('should fail when inventory is full', () => {
            // Fill inventory
            for (let i = 0; i < 25; i++) {
                inventory.addSword({ id: `sword${i}`, level: 1, enhancement: 0, goldValue: 10 }, i);
            }
            
            const result = shop.purchaseBasicSword(100, inventory);
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('Inventory is full');
            expect(result.sword).toBeUndefined();
        });

        test('should work with exact gold amount', () => {
            const result = shop.purchaseBasicSword(20, inventory);
            
            expect(result.success).toBe(true);
            expect(result.sword.level).toBe(1);
        });
    });

    describe('purchaseLuckyBox()', () => {
        test('should successfully purchase lucky box with sufficient gold', () => {
            const result = shop.purchaseLuckyBox(100, inventory);
            
            expect(result.success).toBe(true);
            expect(result.sword).toBeDefined();
            expect(result.sword.level).toBeGreaterThanOrEqual(1);
            expect(result.sword.level).toBeLessThanOrEqual(5);
            expect(result.sword.enhancement).toBe(0);
            expect(result.error).toBeUndefined();
        });

        test('should add sword to inventory', () => {
            const result = shop.purchaseLuckyBox(100, inventory);
            
            expect(inventory.countSwords()).toBe(1);
            expect(inventory.getSword(0)).toBe(result.sword);
        });

        test('should fail with insufficient gold', () => {
            const result = shop.purchaseLuckyBox(50, inventory);
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('Insufficient gold');
            expect(result.sword).toBeUndefined();
            expect(inventory.countSwords()).toBe(0);
        });

        test('should fail when inventory is full', () => {
            // Fill inventory
            for (let i = 0; i < 25; i++) {
                inventory.addSword({ id: `sword${i}`, level: 1, enhancement: 0, goldValue: 10 }, i);
            }
            
            const result = shop.purchaseLuckyBox(100, inventory);
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('Inventory is full');
            expect(result.sword).toBeUndefined();
        });

        test('should work with exact gold amount', () => {
            const result = shop.purchaseLuckyBox(100, inventory);
            
            expect(result.success).toBe(true);
            expect(result.sword.level).toBeGreaterThanOrEqual(1);
            expect(result.sword.level).toBeLessThanOrEqual(5);
        });
    });

    describe('rollLuckyBoxLevel()', () => {
        test('should return level between 1 and 5', () => {
            for (let i = 0; i < 100; i++) {
                const level = shop.rollLuckyBoxLevel();
                expect(level).toBeGreaterThanOrEqual(1);
                expect(level).toBeLessThanOrEqual(5);
            }
        });

        test('should follow weighted probability distribution', () => {
            const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            const iterations = 10000;
            
            for (let i = 0; i < iterations; i++) {
                const level = shop.rollLuckyBoxLevel();
                counts[level]++;
            }
            
            // Check approximate probabilities (with tolerance)
            // Level 1: 50% (5000 ± 500)
            expect(counts[1]).toBeGreaterThan(4500);
            expect(counts[1]).toBeLessThan(5500);
            
            // Level 2: 25% (2500 ± 300)
            expect(counts[2]).toBeGreaterThan(2200);
            expect(counts[2]).toBeLessThan(2800);
            
            // Level 3: 15% (1500 ± 200)
            expect(counts[3]).toBeGreaterThan(1300);
            expect(counts[3]).toBeLessThan(1700);
            
            // Level 4: 7% (700 ± 150)
            expect(counts[4]).toBeGreaterThan(550);
            expect(counts[4]).toBeLessThan(850);
            
            // Level 5: 3% (300 ± 100)
            expect(counts[5]).toBeGreaterThan(200);
            expect(counts[5]).toBeLessThan(400);
        });
    });

    describe('Edge cases', () => {
        test('should handle multiple purchases', () => {
            shop.purchaseBasicSword(100, inventory);
            shop.purchaseBasicSword(100, inventory);
            shop.purchaseLuckyBox(100, inventory);
            
            expect(inventory.countSwords()).toBe(3);
        });

        test('should handle purchase with very high gold amount', () => {
            const result = shop.purchaseBasicSword(1000000, inventory);
            
            expect(result.success).toBe(true);
            expect(result.sword.level).toBe(1);
        });

        test('should handle purchase with gold = 0', () => {
            const result = shop.purchaseBasicSword(0, inventory);
            
            expect(result.success).toBe(false);
            expect(result.error).toContain('Insufficient gold');
        });
    });
});
