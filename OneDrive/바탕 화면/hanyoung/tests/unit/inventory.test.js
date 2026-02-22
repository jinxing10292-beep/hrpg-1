/**
 * Unit tests for InventoryManager
 * Tests for task 3.1: Basic inventory operations
 */

import { InventoryManager } from '../../js/systems/InventoryManager.js';
import { createSword } from '../../js/models/Sword.js';

describe('InventoryManager - Task 3.1', () => {
    let inventory;

    beforeEach(() => {
        inventory = new InventoryManager();
    });

    describe('Initialization', () => {
        test('should initialize with exactly 25 slots', () => {
            expect(inventory.slots).toHaveLength(25);
        });

        test('should initialize all slots with correct positions (0-24)', () => {
            inventory.slots.forEach((slot, index) => {
                expect(slot.position).toBe(index);
            });
        });

        test('should initialize all slots with null sword', () => {
            inventory.slots.forEach(slot => {
                expect(slot.sword).toBeNull();
            });
        });
    });

    describe('getSword()', () => {
        test('should return null for empty slot', () => {
            expect(inventory.getSword(0)).toBeNull();
        });

        test('should return sword when slot is occupied', () => {
            const sword = createSword(1, 0);
            inventory.addSword(sword, 5);
            expect(inventory.getSword(5)).toBe(sword);
        });

        test('should return null for invalid position (negative)', () => {
            expect(inventory.getSword(-1)).toBeNull();
        });

        test('should return null for invalid position (>= 25)', () => {
            expect(inventory.getSword(25)).toBeNull();
            expect(inventory.getSword(100)).toBeNull();
        });
    });

    describe('addSword()', () => {
        test('should add sword to specified position', () => {
            const sword = createSword(1, 0);
            const result = inventory.addSword(sword, 10);
            
            expect(result).toBe(true);
            expect(inventory.getSword(10)).toBe(sword);
        });

        test('should add sword to first empty slot when position not specified', () => {
            const sword = createSword(1, 0);
            const result = inventory.addSword(sword);
            
            expect(result).toBe(true);
            expect(inventory.getSword(0)).toBe(sword);
        });

        test('should add multiple swords to sequential empty slots', () => {
            const sword1 = createSword(1, 0);
            const sword2 = createSword(2, 0);
            const sword3 = createSword(3, 0);
            
            inventory.addSword(sword1);
            inventory.addSword(sword2);
            inventory.addSword(sword3);
            
            expect(inventory.getSword(0)).toBe(sword1);
            expect(inventory.getSword(1)).toBe(sword2);
            expect(inventory.getSword(2)).toBe(sword3);
        });

        test('should fail when adding to occupied position', () => {
            const sword1 = createSword(1, 0);
            const sword2 = createSword(2, 0);
            
            inventory.addSword(sword1, 5);
            const result = inventory.addSword(sword2, 5);
            
            expect(result).toBe(false);
            expect(inventory.getSword(5)).toBe(sword1); // Original sword unchanged
        });

        test('should fail when adding to invalid position (negative)', () => {
            const sword = createSword(1, 0);
            const result = inventory.addSword(sword, -1);
            
            expect(result).toBe(false);
        });

        test('should fail when adding to invalid position (>= 25)', () => {
            const sword = createSword(1, 0);
            const result = inventory.addSword(sword, 25);
            
            expect(result).toBe(false);
        });

        test('should fail when adding invalid sword (null)', () => {
            const result = inventory.addSword(null, 0);
            expect(result).toBe(false);
        });

        test('should fail when adding sword with invalid level', () => {
            const invalidSword = { id: 'test', level: 0, enhancement: 0, goldValue: 0 };
            const result = inventory.addSword(invalidSword, 0);
            expect(result).toBe(false);
        });

        test('should fail when adding sword with negative enhancement', () => {
            const invalidSword = { id: 'test', level: 1, enhancement: -1, goldValue: 10 };
            const result = inventory.addSword(invalidSword, 0);
            expect(result).toBe(false);
        });
    });

    describe('removeSword()', () => {
        test('should remove sword from specified position', () => {
            const sword = createSword(1, 0);
            inventory.addSword(sword, 5);
            
            const removed = inventory.removeSword(5);
            
            expect(removed).toBe(sword);
            expect(inventory.getSword(5)).toBeNull();
        });

        test('should return null when removing from empty slot', () => {
            const removed = inventory.removeSword(5);
            expect(removed).toBeNull();
        });

        test('should return null for invalid position (negative)', () => {
            const removed = inventory.removeSword(-1);
            expect(removed).toBeNull();
        });

        test('should return null for invalid position (>= 25)', () => {
            const removed = inventory.removeSword(25);
            expect(removed).toBeNull();
        });
    });

    describe('findEmptySlot()', () => {
        test('should return 0 for empty inventory', () => {
            expect(inventory.findEmptySlot()).toBe(0);
        });

        test('should return first empty slot position', () => {
            inventory.addSword(createSword(1, 0), 0);
            inventory.addSword(createSword(1, 0), 1);
            inventory.addSword(createSword(1, 0), 2);
            
            expect(inventory.findEmptySlot()).toBe(3);
        });

        test('should return null when inventory is full', () => {
            // Fill all 25 slots
            for (let i = 0; i < 25; i++) {
                inventory.addSword(createSword(1, 0), i);
            }
            
            expect(inventory.findEmptySlot()).toBeNull();
        });

        test('should find empty slot after removal', () => {
            inventory.addSword(createSword(1, 0), 0);
            inventory.addSword(createSword(1, 0), 1);
            inventory.addSword(createSword(1, 0), 2);
            inventory.removeSword(1);
            
            expect(inventory.findEmptySlot()).toBe(1);
        });
    });

    describe('isFull()', () => {
        test('should return false for empty inventory', () => {
            expect(inventory.isFull()).toBe(false);
        });

        test('should return false for partially filled inventory', () => {
            inventory.addSword(createSword(1, 0), 0);
            inventory.addSword(createSword(1, 0), 1);
            
            expect(inventory.isFull()).toBe(false);
        });

        test('should return true when all 25 slots are filled', () => {
            // Fill all 25 slots
            for (let i = 0; i < 25; i++) {
                inventory.addSword(createSword(1, 0), i);
            }
            
            expect(inventory.isFull()).toBe(true);
        });

        test('should return false after removing sword from full inventory', () => {
            // Fill all 25 slots
            for (let i = 0; i < 25; i++) {
                inventory.addSword(createSword(1, 0), i);
            }
            
            inventory.removeSword(10);
            
            expect(inventory.isFull()).toBe(false);
        });
    });

    describe('Edge cases', () => {
        test('should handle adding sword at position 0', () => {
            const sword = createSword(1, 0);
            const result = inventory.addSword(sword, 0);
            
            expect(result).toBe(true);
            expect(inventory.getSword(0)).toBe(sword);
        });

        test('should handle adding sword at position 24 (last slot)', () => {
            const sword = createSword(1, 0);
            const result = inventory.addSword(sword, 24);
            
            expect(result).toBe(true);
            expect(inventory.getSword(24)).toBe(sword);
        });

        test('should handle high level swords', () => {
            const sword = createSword(100, 50);
            const result = inventory.addSword(sword, 0);
            
            expect(result).toBe(true);
            expect(inventory.getSword(0)).toBe(sword);
        });

        test('should fail to add sword when inventory is full', () => {
            // Fill all 25 slots
            for (let i = 0; i < 25; i++) {
                inventory.addSword(createSword(1, 0), i);
            }
            
            const sword = createSword(1, 0);
            const result = inventory.addSword(sword);
            
            expect(result).toBe(false);
        });
    });
});

describe('InventoryManager - Task 3.2: Movement Operations', () => {
    let inventory;

    beforeEach(() => {
        inventory = new InventoryManager();
    });

    describe('moveSword()', () => {
        test('should move sword from one position to empty slot', () => {
            const sword = createSword(5, 2);
            inventory.addSword(sword, 3);
            
            const result = inventory.moveSword(3, 10);
            
            expect(result).toBe(true);
            expect(inventory.getSword(3)).toBeNull();
            expect(inventory.getSword(10)).toBe(sword);
        });

        test('should move sword to adjacent slot', () => {
            const sword = createSword(1, 0);
            inventory.addSword(sword, 0);
            
            const result = inventory.moveSword(0, 1);
            
            expect(result).toBe(true);
            expect(inventory.getSword(0)).toBeNull();
            expect(inventory.getSword(1)).toBe(sword);
        });

        test('should move sword from last slot to first slot', () => {
            const sword = createSword(3, 1);
            inventory.addSword(sword, 24);
            
            const result = inventory.moveSword(24, 0);
            
            expect(result).toBe(true);
            expect(inventory.getSword(24)).toBeNull();
            expect(inventory.getSword(0)).toBe(sword);
        });

        test('should fail when source position has no sword', () => {
            const result = inventory.moveSword(5, 10);
            
            expect(result).toBe(false);
            expect(inventory.getSword(5)).toBeNull();
            expect(inventory.getSword(10)).toBeNull();
        });

        test('should fail when target position is occupied', () => {
            const sword1 = createSword(1, 0);
            const sword2 = createSword(2, 0);
            inventory.addSword(sword1, 5);
            inventory.addSword(sword2, 10);
            
            const result = inventory.moveSword(5, 10);
            
            expect(result).toBe(false);
            expect(inventory.getSword(5)).toBe(sword1);
            expect(inventory.getSword(10)).toBe(sword2);
        });

        test('should fail with invalid source position (negative)', () => {
            const result = inventory.moveSword(-1, 5);
            expect(result).toBe(false);
        });

        test('should fail with invalid source position (>= 25)', () => {
            const result = inventory.moveSword(25, 5);
            expect(result).toBe(false);
        });

        test('should fail with invalid target position (negative)', () => {
            const sword = createSword(1, 0);
            inventory.addSword(sword, 5);
            
            const result = inventory.moveSword(5, -1);
            
            expect(result).toBe(false);
            expect(inventory.getSword(5)).toBe(sword);
        });

        test('should fail with invalid target position (>= 25)', () => {
            const sword = createSword(1, 0);
            inventory.addSword(sword, 5);
            
            const result = inventory.moveSword(5, 25);
            
            expect(result).toBe(false);
            expect(inventory.getSword(5)).toBe(sword);
        });

        test('should preserve sword properties during move', () => {
            const sword = createSword(7, 3);
            inventory.addSword(sword, 0);
            
            inventory.moveSword(0, 15);
            
            const movedSword = inventory.getSword(15);
            expect(movedSword.level).toBe(7);
            expect(movedSword.enhancement).toBe(3);
            expect(movedSword.goldValue).toBe(sword.goldValue);
        });
    });

    describe('swapSwords()', () => {
        test('should swap two swords at different positions', () => {
            const sword1 = createSword(1, 0);
            const sword2 = createSword(5, 2);
            inventory.addSword(sword1, 3);
            inventory.addSword(sword2, 10);
            
            const result = inventory.swapSwords(3, 10);
            
            expect(result).toBe(true);
            expect(inventory.getSword(3)).toBe(sword2);
            expect(inventory.getSword(10)).toBe(sword1);
        });

        test('should swap swords in adjacent positions', () => {
            const sword1 = createSword(2, 1);
            const sword2 = createSword(3, 0);
            inventory.addSword(sword1, 0);
            inventory.addSword(sword2, 1);
            
            const result = inventory.swapSwords(0, 1);
            
            expect(result).toBe(true);
            expect(inventory.getSword(0)).toBe(sword2);
            expect(inventory.getSword(1)).toBe(sword1);
        });

        test('should swap swords at first and last positions', () => {
            const sword1 = createSword(1, 0);
            const sword2 = createSword(10, 5);
            inventory.addSword(sword1, 0);
            inventory.addSword(sword2, 24);
            
            const result = inventory.swapSwords(0, 24);
            
            expect(result).toBe(true);
            expect(inventory.getSword(0)).toBe(sword2);
            expect(inventory.getSword(24)).toBe(sword1);
        });

        test('should fail when first position is empty', () => {
            const sword = createSword(1, 0);
            inventory.addSword(sword, 10);
            
            const result = inventory.swapSwords(5, 10);
            
            expect(result).toBe(false);
            expect(inventory.getSword(5)).toBeNull();
            expect(inventory.getSword(10)).toBe(sword);
        });

        test('should fail when second position is empty', () => {
            const sword = createSword(1, 0);
            inventory.addSword(sword, 5);
            
            const result = inventory.swapSwords(5, 10);
            
            expect(result).toBe(false);
            expect(inventory.getSword(5)).toBe(sword);
            expect(inventory.getSword(10)).toBeNull();
        });

        test('should fail when both positions are empty', () => {
            const result = inventory.swapSwords(5, 10);
            
            expect(result).toBe(false);
            expect(inventory.getSword(5)).toBeNull();
            expect(inventory.getSword(10)).toBeNull();
        });

        test('should fail when swapping same position', () => {
            const sword = createSword(1, 0);
            inventory.addSword(sword, 5);
            
            const result = inventory.swapSwords(5, 5);
            
            expect(result).toBe(false);
            expect(inventory.getSword(5)).toBe(sword);
        });

        test('should fail with invalid first position (negative)', () => {
            const sword = createSword(1, 0);
            inventory.addSword(sword, 5);
            
            const result = inventory.swapSwords(-1, 5);
            expect(result).toBe(false);
        });

        test('should fail with invalid first position (>= 25)', () => {
            const sword = createSword(1, 0);
            inventory.addSword(sword, 5);
            
            const result = inventory.swapSwords(25, 5);
            expect(result).toBe(false);
        });

        test('should fail with invalid second position (negative)', () => {
            const sword = createSword(1, 0);
            inventory.addSword(sword, 5);
            
            const result = inventory.swapSwords(5, -1);
            expect(result).toBe(false);
        });

        test('should fail with invalid second position (>= 25)', () => {
            const sword = createSword(1, 0);
            inventory.addSword(sword, 5);
            
            const result = inventory.swapSwords(5, 30);
            expect(result).toBe(false);
        });

        test('should preserve sword properties during swap', () => {
            const sword1 = createSword(3, 2);
            const sword2 = createSword(8, 4);
            inventory.addSword(sword1, 5);
            inventory.addSword(sword2, 15);
            
            inventory.swapSwords(5, 15);
            
            const swappedSword1 = inventory.getSword(15);
            const swappedSword2 = inventory.getSword(5);
            
            expect(swappedSword1.level).toBe(3);
            expect(swappedSword1.enhancement).toBe(2);
            expect(swappedSword2.level).toBe(8);
            expect(swappedSword2.enhancement).toBe(4);
        });

        test('should work with swords of same level', () => {
            const sword1 = createSword(5, 0);
            const sword2 = createSword(5, 0);
            inventory.addSword(sword1, 3);
            inventory.addSword(sword2, 7);
            
            const result = inventory.swapSwords(3, 7);
            
            expect(result).toBe(true);
            expect(inventory.getSword(3)).toBe(sword2);
            expect(inventory.getSword(7)).toBe(sword1);
        });
    });

    describe('Movement operations edge cases', () => {
        test('should handle multiple sequential moves', () => {
            const sword = createSword(1, 0);
            inventory.addSword(sword, 0);
            
            inventory.moveSword(0, 5);
            inventory.moveSword(5, 10);
            inventory.moveSword(10, 24);
            
            expect(inventory.getSword(0)).toBeNull();
            expect(inventory.getSword(5)).toBeNull();
            expect(inventory.getSword(10)).toBeNull();
            expect(inventory.getSword(24)).toBe(sword);
        });

        test('should handle multiple sequential swaps', () => {
            const sword1 = createSword(1, 0);
            const sword2 = createSword(2, 0);
            const sword3 = createSword(3, 0);
            inventory.addSword(sword1, 0);
            inventory.addSword(sword2, 1);
            inventory.addSword(sword3, 2);
            
            inventory.swapSwords(0, 1);
            inventory.swapSwords(1, 2);
            
            expect(inventory.getSword(0)).toBe(sword2);
            expect(inventory.getSword(1)).toBe(sword3);
            expect(inventory.getSword(2)).toBe(sword1);
        });

        test('should handle move and swap combinations', () => {
            const sword1 = createSword(1, 0);
            const sword2 = createSword(2, 0);
            inventory.addSword(sword1, 0);
            inventory.addSword(sword2, 5);
            
            inventory.moveSword(0, 10);
            inventory.swapSwords(5, 10);
            
            expect(inventory.getSword(0)).toBeNull();
            expect(inventory.getSword(5)).toBe(sword1);
            expect(inventory.getSword(10)).toBe(sword2);
        });
    });
});

describe('InventoryManager - Task 3.4: Query and Utility Methods', () => {
    let inventory;

    beforeEach(() => {
        inventory = new InventoryManager();
    });

    describe('getAllSwords()', () => {
        test('should return empty array for empty inventory', () => {
            const swords = inventory.getAllSwords();
            expect(swords).toEqual([]);
            expect(swords).toHaveLength(0);
        });

        test('should return array with single sword', () => {
            const sword = createSword(1, 0);
            inventory.addSword(sword, 5);
            
            const swords = inventory.getAllSwords();
            expect(swords).toHaveLength(1);
            expect(swords[0]).toBe(sword);
        });

        test('should return all swords excluding nulls', () => {
            const sword1 = createSword(1, 0);
            const sword2 = createSword(2, 1);
            const sword3 = createSword(3, 2);
            
            inventory.addSword(sword1, 0);
            inventory.addSword(sword2, 5);
            inventory.addSword(sword3, 24);
            
            const swords = inventory.getAllSwords();
            expect(swords).toHaveLength(3);
            expect(swords).toContain(sword1);
            expect(swords).toContain(sword2);
            expect(swords).toContain(sword3);
        });

        test('should return all 25 swords when inventory is full', () => {
            for (let i = 0; i < 25; i++) {
                inventory.addSword(createSword(1, 0), i);
            }
            
            const swords = inventory.getAllSwords();
            expect(swords).toHaveLength(25);
        });

        test('should not include null values in returned array', () => {
            inventory.addSword(createSword(1, 0), 0);
            inventory.addSword(createSword(2, 0), 10);
            
            const swords = inventory.getAllSwords();
            expect(swords.every(sword => sword !== null)).toBe(true);
        });
    });

    describe('getTotalValue()', () => {
        test('should return 0 for empty inventory', () => {
            expect(inventory.getTotalValue()).toBe(0);
        });

        test('should return correct value for single sword', () => {
            const sword = createSword(1, 0); // goldValue = 10
            inventory.addSword(sword, 0);
            
            expect(inventory.getTotalValue()).toBe(10);
        });

        test('should sum values of multiple swords', () => {
            const sword1 = createSword(1, 0); // goldValue = 10
            const sword2 = createSword(2, 0); // goldValue = 20
            const sword3 = createSword(3, 0); // goldValue = 40
            
            inventory.addSword(sword1, 0);
            inventory.addSword(sword2, 5);
            inventory.addSword(sword3, 10);
            
            // Total: 10 + 20 + 40 = 70
            expect(inventory.getTotalValue()).toBe(70);
        });

        test('should include enhanced sword values', () => {
            const sword1 = createSword(1, 0); // goldValue = 10
            const sword2 = createSword(1, 1); // goldValue = 15
            const sword3 = createSword(1, 2); // goldValue = 20
            
            inventory.addSword(sword1, 0);
            inventory.addSword(sword2, 1);
            inventory.addSword(sword3, 2);
            
            // Total: 10 + 15 + 20 = 45
            expect(inventory.getTotalValue()).toBe(45);
        });

        test('should handle high-value swords', () => {
            const sword1 = createSword(10, 5); // High level and enhancement
            const sword2 = createSword(8, 3);
            
            inventory.addSword(sword1, 0);
            inventory.addSword(sword2, 1);
            
            const total = inventory.getTotalValue();
            expect(total).toBe(sword1.goldValue + sword2.goldValue);
            expect(total).toBeGreaterThan(0);
        });

        test('should update after removing sword', () => {
            const sword1 = createSword(1, 0); // goldValue = 10
            const sword2 = createSword(2, 0); // goldValue = 20
            
            inventory.addSword(sword1, 0);
            inventory.addSword(sword2, 1);
            
            expect(inventory.getTotalValue()).toBe(30);
            
            inventory.removeSword(0);
            expect(inventory.getTotalValue()).toBe(20);
        });
    });

    describe('countSwords()', () => {
        test('should return 0 for empty inventory', () => {
            expect(inventory.countSwords()).toBe(0);
        });

        test('should return 1 for single sword', () => {
            inventory.addSword(createSword(1, 0), 0);
            expect(inventory.countSwords()).toBe(1);
        });

        test('should count multiple swords correctly', () => {
            inventory.addSword(createSword(1, 0), 0);
            inventory.addSword(createSword(2, 0), 5);
            inventory.addSword(createSword(3, 0), 10);
            
            expect(inventory.countSwords()).toBe(3);
        });

        test('should return 25 for full inventory', () => {
            for (let i = 0; i < 25; i++) {
                inventory.addSword(createSword(1, 0), i);
            }
            
            expect(inventory.countSwords()).toBe(25);
        });

        test('should update after adding sword', () => {
            expect(inventory.countSwords()).toBe(0);
            
            inventory.addSword(createSword(1, 0), 0);
            expect(inventory.countSwords()).toBe(1);
            
            inventory.addSword(createSword(1, 0), 1);
            expect(inventory.countSwords()).toBe(2);
        });

        test('should update after removing sword', () => {
            inventory.addSword(createSword(1, 0), 0);
            inventory.addSword(createSword(1, 0), 1);
            inventory.addSword(createSword(1, 0), 2);
            
            expect(inventory.countSwords()).toBe(3);
            
            inventory.removeSword(1);
            expect(inventory.countSwords()).toBe(2);
        });
    });

    describe('sortByLevel()', () => {
        test('should do nothing for empty inventory', () => {
            inventory.sortByLevel();
            
            expect(inventory.countSwords()).toBe(0);
            inventory.slots.forEach(slot => {
                expect(slot.sword).toBeNull();
            });
        });

        test('should sort swords by level in descending order', () => {
            const sword1 = createSword(1, 0);
            const sword2 = createSword(5, 0);
            const sword3 = createSword(3, 0);
            
            inventory.addSword(sword1, 0);
            inventory.addSword(sword2, 5);
            inventory.addSword(sword3, 10);
            
            inventory.sortByLevel();
            
            // Should be sorted: level 5, level 3, level 1
            expect(inventory.getSword(0).level).toBe(5);
            expect(inventory.getSword(1).level).toBe(3);
            expect(inventory.getSword(2).level).toBe(1);
        });

        test('should place empty slots at the end', () => {
            const sword1 = createSword(2, 0);
            const sword2 = createSword(4, 0);
            
            inventory.addSword(sword1, 10);
            inventory.addSword(sword2, 20);
            
            inventory.sortByLevel();
            
            // Swords should be at positions 0 and 1
            expect(inventory.getSword(0).level).toBe(4);
            expect(inventory.getSword(1).level).toBe(2);
            
            // Remaining slots should be empty
            for (let i = 2; i < 25; i++) {
                expect(inventory.getSword(i)).toBeNull();
            }
        });

        test('should preserve sword properties during sort', () => {
            const sword1 = createSword(3, 2);
            const sword2 = createSword(7, 4);
            const sword3 = createSword(1, 0);
            
            inventory.addSword(sword1, 0);
            inventory.addSword(sword2, 5);
            inventory.addSword(sword3, 10);
            
            inventory.sortByLevel();
            
            // Check that sword properties are preserved
            const sortedSwords = inventory.getAllSwords();
            expect(sortedSwords[0].level).toBe(7);
            expect(sortedSwords[0].enhancement).toBe(4);
            expect(sortedSwords[1].level).toBe(3);
            expect(sortedSwords[1].enhancement).toBe(2);
            expect(sortedSwords[2].level).toBe(1);
            expect(sortedSwords[2].enhancement).toBe(0);
        });

        test('should handle swords with same level', () => {
            const sword1 = createSword(5, 0);
            const sword2 = createSword(5, 1);
            const sword3 = createSword(5, 2);
            
            inventory.addSword(sword1, 0);
            inventory.addSword(sword2, 5);
            inventory.addSword(sword3, 10);
            
            inventory.sortByLevel();
            
            // All should be level 5 and at the beginning
            expect(inventory.getSword(0).level).toBe(5);
            expect(inventory.getSword(1).level).toBe(5);
            expect(inventory.getSword(2).level).toBe(5);
        });

        test('should sort full inventory correctly', () => {
            // Add swords with random levels
            const levels = [3, 1, 5, 2, 4, 7, 6, 9, 8, 10, 
                           2, 4, 1, 3, 5, 6, 8, 7, 9, 10,
                           1, 2, 3, 4, 5];
            
            levels.forEach((level, index) => {
                inventory.addSword(createSword(level, 0), index);
            });
            
            inventory.sortByLevel();
            
            // Verify descending order
            const sortedSwords = inventory.getAllSwords();
            for (let i = 0; i < sortedSwords.length - 1; i++) {
                expect(sortedSwords[i].level).toBeGreaterThanOrEqual(sortedSwords[i + 1].level);
            }
        });

        test('should maintain count after sorting', () => {
            inventory.addSword(createSword(1, 0), 0);
            inventory.addSword(createSword(5, 0), 10);
            inventory.addSword(createSword(3, 0), 20);
            
            const countBefore = inventory.countSwords();
            inventory.sortByLevel();
            const countAfter = inventory.countSwords();
            
            expect(countAfter).toBe(countBefore);
            expect(countAfter).toBe(3);
        });

        test('should maintain total value after sorting', () => {
            inventory.addSword(createSword(1, 0), 0);
            inventory.addSword(createSword(5, 2), 10);
            inventory.addSword(createSword(3, 1), 20);
            
            const valueBefore = inventory.getTotalValue();
            inventory.sortByLevel();
            const valueAfter = inventory.getTotalValue();
            
            expect(valueAfter).toBe(valueBefore);
        });
    });

    describe('clear()', () => {
        test('should clear empty inventory', () => {
            inventory.clear();
            
            expect(inventory.countSwords()).toBe(0);
            inventory.slots.forEach(slot => {
                expect(slot.sword).toBeNull();
            });
        });

        test('should clear single sword', () => {
            inventory.addSword(createSword(1, 0), 5);
            
            inventory.clear();
            
            expect(inventory.countSwords()).toBe(0);
            expect(inventory.getSword(5)).toBeNull();
        });

        test('should clear multiple swords', () => {
            inventory.addSword(createSword(1, 0), 0);
            inventory.addSword(createSword(2, 0), 5);
            inventory.addSword(createSword(3, 0), 10);
            
            inventory.clear();
            
            expect(inventory.countSwords()).toBe(0);
            expect(inventory.getTotalValue()).toBe(0);
            inventory.slots.forEach(slot => {
                expect(slot.sword).toBeNull();
            });
        });

        test('should clear full inventory', () => {
            for (let i = 0; i < 25; i++) {
                inventory.addSword(createSword(1, 0), i);
            }
            
            expect(inventory.isFull()).toBe(true);
            
            inventory.clear();
            
            expect(inventory.countSwords()).toBe(0);
            expect(inventory.isFull()).toBe(false);
            inventory.slots.forEach(slot => {
                expect(slot.sword).toBeNull();
            });
        });

        test('should allow adding swords after clear', () => {
            inventory.addSword(createSword(1, 0), 0);
            inventory.addSword(createSword(2, 0), 1);
            
            inventory.clear();
            
            const newSword = createSword(5, 0);
            const result = inventory.addSword(newSword, 0);
            
            expect(result).toBe(true);
            expect(inventory.getSword(0)).toBe(newSword);
            expect(inventory.countSwords()).toBe(1);
        });

        test('should reset total value to 0', () => {
            inventory.addSword(createSword(5, 3), 0);
            inventory.addSword(createSword(10, 5), 1);
            
            expect(inventory.getTotalValue()).toBeGreaterThan(0);
            
            inventory.clear();
            
            expect(inventory.getTotalValue()).toBe(0);
        });
    });

    describe('Query and utility methods integration', () => {
        test('should work together: add, sort, count, get total', () => {
            inventory.addSword(createSword(3, 0), 0);
            inventory.addSword(createSword(1, 0), 5);
            inventory.addSword(createSword(5, 0), 10);
            
            expect(inventory.countSwords()).toBe(3);
            
            const valueBefore = inventory.getTotalValue();
            inventory.sortByLevel();
            const valueAfter = inventory.getTotalValue();
            
            expect(valueAfter).toBe(valueBefore);
            expect(inventory.getSword(0).level).toBe(5);
            expect(inventory.getSword(1).level).toBe(3);
            expect(inventory.getSword(2).level).toBe(1);
        });

        test('should work together: add, get all, clear', () => {
            inventory.addSword(createSword(1, 0), 0);
            inventory.addSword(createSword(2, 0), 1);
            inventory.addSword(createSword(3, 0), 2);
            
            const swords = inventory.getAllSwords();
            expect(swords).toHaveLength(3);
            
            inventory.clear();
            
            const swordsAfter = inventory.getAllSwords();
            expect(swordsAfter).toHaveLength(0);
        });
    });
});
