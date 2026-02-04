/**
 * Drag and Drop Handler - Manages drag-and-drop interactions
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

export class DragDropHandler {
    constructor() {
        this.draggedElement = null;
        this.draggedPosition = null;
    }

    /**
     * Initialize drag and drop event listeners
     * @param {Object} inventory - InventoryManager instance
     * @param {Object} mergeSystem - MergeSystem instance
     * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
     */
    initializeDragDrop(inventory, mergeSystem) {
        // Get all inventory slots
        const slots = document.querySelectorAll('.inventory-slot');
        
        slots.forEach((slotElement, index) => {
            const position = parseInt(slotElement.dataset.position);
            
            // Make slots with swords draggable
            const swordElement = slotElement.querySelector('.sword');
            if (swordElement) {
                swordElement.draggable = true;
                
                // Attach drag start event
                swordElement.addEventListener('dragstart', (e) => {
                    this.onDragStart(e, position);
                });
                
                // Attach drag end event to clean up
                swordElement.addEventListener('dragend', (e) => {
                    this.clearDragState();
                });
            }
            
            // All slots can be drop targets
            slotElement.addEventListener('dragover', (e) => {
                this.onDragOver(e);
            });
            
            slotElement.addEventListener('dragleave', (e) => {
                // Remove highlight when leaving
                e.currentTarget.classList.remove('drag-over');
            });
            
            slotElement.addEventListener('drop', (e) => {
                this.onDrop(e, position, inventory, mergeSystem);
            });
        });
    }

    /**
     * Handle drag start event
     * @param {DragEvent} event - The drag event
     * @param {number} position - The position being dragged
     * Requirements: 2.1 - Provide visual feedback indicating the drag operation
     */
    onDragStart(event, position) {
        // Store the dragged position
        this.draggedPosition = position;
        this.draggedElement = event.target;
        
        // Set data transfer
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', position.toString());
        
        // Add visual feedback - make the dragged element semi-transparent
        event.target.classList.add('dragging');
        
        // Also add a class to the parent slot
        const slotElement = event.target.closest('.inventory-slot');
        if (slotElement) {
            slotElement.classList.add('dragging-source');
        }
    }

    /**
     * Handle drag over event
     * @param {DragEvent} event - The drag event
     * Requirements: 2.2 - Highlight the target slot
     */
    onDragOver(event) {
        // Prevent default to allow drop
        event.preventDefault();
        
        // Set drop effect
        event.dataTransfer.dropEffect = 'move';
        
        // Highlight drop target
        const slotElement = event.currentTarget;
        if (slotElement && !slotElement.classList.contains('dragging-source')) {
            slotElement.classList.add('drag-over');
        }
    }

    /**
     * Handle drop event
     * @param {DragEvent} event - The drag event
     * @param {number} targetPosition - The target position
     * @param {Object} inventory - InventoryManager instance
     * @param {Object} mergeSystem - MergeSystem instance
     * Requirements: 2.3, 2.4, 2.5 - Move to empty slot, swap swords, or merge
     */
    onDrop(event, targetPosition, inventory, mergeSystem) {
        // Prevent default behavior
        event.preventDefault();
        
        // Get source position
        const sourcePosition = this.draggedPosition;
        
        if (sourcePosition === null || sourcePosition === targetPosition) {
            this.clearDragState();
            return;
        }
        
        // Get swords at both positions
        const sourceSword = inventory.getSword(sourcePosition);
        const targetSword = inventory.getSword(targetPosition);
        
        if (!sourceSword) {
            this.clearDragState();
            return;
        }
        
        // Determine action based on target slot
        if (targetSword) {
            // Target slot has a sword
            if (mergeSystem.canMerge(sourceSword, targetSword)) {
                // Requirement 2.5: Execute merge operation
                this.handleMerge(sourcePosition, targetPosition, inventory, mergeSystem);
            } else {
                // Requirement 2.4: Swap the two swords
                inventory.swapSwords(sourcePosition, targetPosition);
            }
        } else {
            // Requirement 2.3: Move sword to empty slot
            inventory.moveSword(sourcePosition, targetPosition);
        }
        
        // Clean up drag state
        this.clearDragState();
        
        // Trigger UI update (will be handled by GameController in task 17)
        // For now, dispatch a custom event that can be listened to
        document.dispatchEvent(new CustomEvent('inventoryChanged', {
            detail: { sourcePosition, targetPosition }
        }));
    }

    /**
     * Handle merge operation during drop
     * @param {number} pos1 - First position
     * @param {number} pos2 - Second position
     * @param {Object} inventory - InventoryManager instance
     * @param {Object} mergeSystem - MergeSystem instance
     * Requirements: 3.1, 3.2, 3.3 - Execute merge and place result
     */
    handleMerge(pos1, pos2, inventory, mergeSystem) {
        // Get both swords
        const sword1 = inventory.getSword(pos1);
        const sword2 = inventory.getSword(pos2);
        
        if (!sword1 || !sword2) {
            console.error('Cannot merge: missing sword(s)');
            return;
        }
        
        // Verify merge is valid
        if (!mergeSystem.canMerge(sword1, sword2)) {
            console.error('Cannot merge: swords have different levels');
            return;
        }
        
        // Perform merge
        const mergedSword = mergeSystem.merge(sword1, sword2);
        
        // Remove both source swords
        inventory.removeSword(pos1);
        inventory.removeSword(pos2);
        
        // Add merged sword to target position (pos2)
        inventory.addSword(mergedSword, pos2);
        
        // Dispatch merge event for GameController to handle statistics
        document.dispatchEvent(new CustomEvent('swordMerged', {
            detail: { 
                sourcePosition: pos1, 
                targetPosition: pos2,
                mergedSword: mergedSword
            }
        }));
    }

    /**
     * Clear drag state and remove visual feedback
     * Requirements: 2.1, 2.2 - Clean up visual feedback
     */
    clearDragState() {
        // Remove dragging class from element
        if (this.draggedElement) {
            this.draggedElement.classList.remove('dragging');
        }
        
        // Remove dragging-source class from all slots
        document.querySelectorAll('.inventory-slot').forEach(slot => {
            slot.classList.remove('dragging-source');
            slot.classList.remove('drag-over');
        });
        
        // Reset state
        this.draggedElement = null;
        this.draggedPosition = null;
    }
}
