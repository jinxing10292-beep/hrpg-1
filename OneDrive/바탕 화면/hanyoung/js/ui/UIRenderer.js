/**
 * UI Renderer - Handles rendering game state to the DOM
 * Requirements: 1.2, 1.3, 11.1, 11.2, 11.3
 */

export class UIRenderer {
    /**
     * Render the inventory grid
     * @param {Object} inventory - InventoryManager instance
     * Requirements: 1.2, 1.3
     */
    renderInventory(inventory) {
        const gridElement = document.getElementById('inventory-grid');
        if (!gridElement) {
            console.error('Inventory grid element not found');
            return;
        }

        // Clear existing content
        gridElement.innerHTML = '';

        // Render all 25 slots
        const slots = inventory.slots;
        slots.forEach(slot => {
            const slotElement = this.renderSlot(slot);
            gridElement.appendChild(slotElement);
        });
    }

    /**
     * Render a single inventory slot
     * @param {Object} slot - InventorySlot object with position and sword properties
     * @returns {HTMLElement} The slot element
     * Requirements: 1.2, 1.3, 11.2
     */
    renderSlot(slot) {
        const slotElement = document.createElement('div');
        slotElement.className = 'inventory-slot';
        slotElement.dataset.position = slot.position.toString();

        if (slot.sword) {
            // Slot contains a sword - display sword information
            slotElement.innerHTML = `
                <div class="sword" draggable="true">
                    <div class="sword-level">Lv.${slot.sword.level}</div>
                    <div class="sword-enhancement">+${slot.sword.enhancement}</div>
                    <div class="sword-value">${slot.sword.goldValue}G</div>
                </div>
            `;
            slotElement.classList.add('occupied');
        } else {
            // Empty slot - display as available
            slotElement.classList.add('empty');
        }

        return slotElement;
    }

    /**
     * Render the gold display
     * @param {number} amount - Current gold amount
     * Requirements: 11.1
     */
    renderGold(amount) {
        const goldElement = document.getElementById('gold-amount');
        if (!goldElement) {
            console.error('Gold amount element not found');
            return;
        }

        // Format number with commas for readability
        goldElement.textContent = this.formatNumber(amount);
    }

    /**
     * Render the quest list
     * @param {Array} quests - Array of Quest objects
     * Requirements: 11.1, 11.2
     */
    renderQuests(quests) {
        const questListElement = document.getElementById('quest-list');
        if (!questListElement) {
            console.error('Quest list element not found');
            return;
        }

        // Clear existing content
        questListElement.innerHTML = '';

        if (quests.length === 0) {
            questListElement.innerHTML = '<p class="empty-message">No active quests</p>';
            return;
        }

        // Render each quest
        quests.forEach(quest => {
            const questElement = this.createQuestElement(quest);
            questListElement.appendChild(questElement);
        });
    }

    /**
     * Create a quest element with progress bar
     * @param {Object} quest - Quest object
     * @returns {HTMLElement} The quest element
     * Requirements: 11.2
     */
    createQuestElement(quest) {
        const questElement = document.createElement('div');
        questElement.className = 'quest-item';
        questElement.dataset.questId = quest.id;

        // Calculate progress percentage
        const progress = Math.min(100, (quest.objective.current / quest.objective.target) * 100);
        const isCompleted = quest.objective.current >= quest.objective.target;
        const isClaimed = quest.claimed;

        // Add status classes
        if (isClaimed) {
            questElement.classList.add('claimed');
        } else if (isCompleted) {
            questElement.classList.add('completed');
        }

        questElement.innerHTML = `
            <div class="quest-header">
                <h3 class="quest-title">${quest.title}</h3>
                <span class="quest-reward">${quest.reward}G</span>
            </div>
            <p class="quest-description">${quest.description}</p>
            <div class="quest-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <span class="progress-text">${quest.objective.current}/${quest.objective.target}</span>
            </div>
            ${isClaimed ? '<button class="quest-claim-btn" disabled>Claimed</button>' : 
              isCompleted ? '<button class="quest-claim-btn" data-quest-id="' + quest.id + '">Claim Reward</button>' : 
              '<button class="quest-claim-btn" disabled>In Progress</button>'}
        `;

        return questElement;
    }

    /**
     * Render the achievement list
     * @param {Array} achievements - Array of Achievement objects
     * Requirements: 11.1, 11.2
     */
    renderAchievements(achievements) {
        const achievementListElement = document.getElementById('achievement-list');
        if (!achievementListElement) {
            console.error('Achievement list element not found');
            return;
        }

        // Clear existing content
        achievementListElement.innerHTML = '';

        if (achievements.length === 0) {
            achievementListElement.innerHTML = '<p class="empty-message">No achievements</p>';
            return;
        }

        // Render each achievement
        achievements.forEach(achievement => {
            const achievementElement = this.createAchievementElement(achievement);
            achievementListElement.appendChild(achievementElement);
        });
    }

    /**
     * Create an achievement element with unlock status
     * @param {Object} achievement - Achievement object
     * @returns {HTMLElement} The achievement element
     * Requirements: 11.2
     */
    createAchievementElement(achievement) {
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement-item';
        achievementElement.dataset.achievementId = achievement.id;

        const isUnlocked = achievement.unlocked;
        const progress = Math.min(100, (achievement.condition.current / achievement.condition.threshold) * 100);

        // Add status class
        if (isUnlocked) {
            achievementElement.classList.add('unlocked');
        } else {
            achievementElement.classList.add('locked');
        }

        achievementElement.innerHTML = `
            <div class="achievement-header">
                <h3 class="achievement-title">${achievement.title}</h3>
                <span class="achievement-status">${isUnlocked ? '✓ Unlocked' : '🔒 Locked'}</span>
            </div>
            <p class="achievement-description">${achievement.description}</p>
            ${!isUnlocked ? `
                <div class="achievement-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="progress-text">${achievement.condition.current}/${achievement.condition.threshold}</span>
                </div>
            ` : ''}
        `;

        return achievementElement;
    }

    /**
     * Render the shop with current prices and availability
     * @param {number} playerGold - Current player gold
     * Requirements: 11.1, 11.2
     */
    renderShop(playerGold) {
        const buySwordBtn = document.getElementById('buy-sword-btn');
        const buyLuckyBoxBtn = document.getElementById('buy-lucky-box-btn');

        if (!buySwordBtn || !buyLuckyBoxBtn) {
            console.error('Shop button elements not found');
            return;
        }

        const BASIC_SWORD_COST = 20;
        const LUCKY_BOX_COST = 100;

        // Update button availability based on player gold
        if (playerGold >= BASIC_SWORD_COST) {
            buySwordBtn.disabled = false;
            buySwordBtn.classList.remove('disabled');
        } else {
            buySwordBtn.disabled = true;
            buySwordBtn.classList.add('disabled');
        }

        if (playerGold >= LUCKY_BOX_COST) {
            buyLuckyBoxBtn.disabled = false;
            buyLuckyBoxBtn.classList.remove('disabled');
        } else {
            buyLuckyBoxBtn.disabled = true;
            buyLuckyBoxBtn.classList.add('disabled');
        }
    }

    /**
     * Show enhancement result modal
     * @param {string} result - EnhancementResult (SUCCESS, MAINTAIN, DESTROY)
     * @param {Object} sword - The sword (if not destroyed)
     * Requirements: 11.3
     */
    showEnhancementResult(result, sword = null) {
        const modal = document.createElement('div');
        modal.className = 'modal enhancement-result';

        let message = '';
        let modalClass = '';

        switch (result) {
            case 'SUCCESS':
                message = `Success! Sword enhanced to +${sword.enhancement}`;
                modalClass = 'success';
                break;
            case 'MAINTAIN':
                message = 'Enhancement maintained current level';
                modalClass = 'maintain';
                break;
            case 'DESTROY':
                message = 'Enhancement failed! Sword destroyed';
                modalClass = 'destroy';
                break;
            default:
                message = 'Enhancement complete';
                modalClass = 'info';
        }

        modal.innerHTML = `
            <div class="modal-content ${modalClass}">
                <p class="modal-message">${message}</p>
            </div>
        `;

        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.appendChild(modal);

            // Auto-remove after 2 seconds
            setTimeout(() => {
                modal.classList.add('fade-out');
                setTimeout(() => modal.remove(), 300);
            }, 2000);
        }
    }

    /**
     * Update gold display with animation
     * @param {number} newAmount - New gold amount
     * Requirements: 11.3
     */
    updateGoldDisplay(newAmount) {
        const goldElement = document.getElementById('gold-amount');
        if (!goldElement) {
            console.error('Gold amount element not found');
            return;
        }

        const oldAmount = parseInt(goldElement.textContent.replace(/,/g, '')) || 0;

        // Animate number change
        this.animateNumber(goldElement, oldAmount, newAmount, 500);
    }

    /**
     * Animate a number change
     * @param {HTMLElement} element - The element to update
     * @param {number} start - Starting value
     * @param {number} end - Ending value
     * @param {number} duration - Animation duration in milliseconds
     * Requirements: 11.3
     */
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const current = Math.floor(start + (end - start) * progress);
            element.textContent = this.formatNumber(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Format a number with commas for readability
     * @param {number} num - The number to format
     * @returns {string} Formatted number string
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * Show a notification message
     * @param {string} message - The message to display
     * @param {string} type - Message type (success, error, info)
     * Requirements: 11.3
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.appendChild(notification);

            // Auto-remove after 3 seconds
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }
}
