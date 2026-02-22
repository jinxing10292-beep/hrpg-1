// 게임 로직
class GameManager {
    constructor() {
        this.gameMode = null;
        this.playerHealth = 100;
        this.opponentHealth = 100;
        this.opponent2Health = 100;
        this.playerMana = 5;
        this.maxMana = 5;
        this.opponentMana = 5;
        this.maxOpponentMana = 5;
        this.opponent2Mana = 5;
        this.maxOpponent2Mana = 5;
        this.currentTurn = 'player';
        this.gameActive = false;
        this.selectedCard = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('play-ai-btn').addEventListener('click', () => this.startGame('ai'));
        document.getElementById('play-1v1-btn').addEventListener('click', () => this.startGame('1v1'));
        document.getElementById('play-1v1v1-btn').addEventListener('click', () => this.startGame('1v1v1'));
        document.getElementById('deck-btn').addEventListener('click', () => this.showDeckBuilder());
        document.getElementById('inventory-btn').addEventListener('click', () => this.showInventory());
        document.getElementById('stats-btn').addEventListener('click', () => this.showStats());

        document.getElementById('end-turn-btn-ai').addEventListener('click', () => this.endTurn());
        document.getElementById('surrender-btn-ai').addEventListener('click', () => this.surrender());
        document.getElementById('back-btn-ai').addEventListener('click', () => this.backToMenu());

        document.getElementById('end-turn-btn-1v1').addEventListener('click', () => this.endTurn());
        document.getElementById('surrender-btn-1v1').addEventListener('click', () => this.surrender());
        document.getElementById('back-btn-1v1').addEventListener('click', () => this.backToMenu());

        document.getElementById('end-turn-btn-1v1v1').addEventListener('click', () => this.endTurn());
        document.getElementById('surrender-btn-1v1v1').addEventListener('click', () => this.surrender());
        document.getElementById('back-btn-1v1v1').addEventListener('click', () => this.backToMenu());
    }

    startGame(mode) {
        this.gameMode = mode;
        this.playerHealth = 100;
        this.opponentHealth = 100;
        this.opponent2Health = 100;
        this.playerMana = 5;
        this.maxMana = 5;
        this.opponentMana = 5;
        this.maxOpponentMana = 5;
        this.currentTurn = 'player';
        this.gameActive = true;

        document.getElementById('main-screen').classList.remove('active');
        if (mode === 'ai') {
            document.getElementById('game-ai-screen').classList.add('active');
            this.initGameAI();
        } else if (mode === '1v1') {
            document.getElementById('game-1v1-screen').classList.add('active');
            this.initGame1v1();
        } else {
            document.getElementById('game-1v1v1-screen').classList.add('active');
            this.initGame1v1v1();
        }

        showToast('게임 시작!', 'success');
    }

    initGameAI() {
        const unitCards = [1, 2, 3, 4, 5, 6, 7, 8];
        const spellCards = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122];
        const testDeck = [...unitCards, ...spellCards];
        cardManager.playerDeck = cardManager.createDeck(testDeck);
        cardManager.opponentDeck = cardManager.createDeck(testDeck);

        for (let i = 0; i < 5; i++) {
            const card = cardManager.playerDeck.shift();
            cardManager.addToHand(card, true);
            const opponentCard = cardManager.opponentDeck.shift();
            cardManager.addToHand(opponentCard, false);
        }

        document.getElementById('opponent-name-ai').textContent = 'AI';
        this.updateUIAI();
        this.renderHandAI();
        this.setupCardClickHandlersAI();
    }

    initGame1v1() {
        const unitCards = [1, 2, 3, 4, 5, 6, 7, 8];
        const spellCards = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122];
        const testDeck = [...unitCards, ...spellCards];
        cardManager.playerDeck = cardManager.createDeck(testDeck);
        cardManager.opponentDeck = cardManager.createDeck(testDeck);

        for (let i = 0; i < 5; i++) {
            const card = cardManager.playerDeck.shift();
            cardManager.addToHand(card, true);
            const opponentCard = cardManager.opponentDeck.shift();
            cardManager.addToHand(opponentCard, false);
        }

        this.updateUI1v1();
        this.renderHand1v1();
        this.setupCardClickHandlers1v1();
    }

    initGame1v1v1() {
        const unitCards = [1, 2, 3, 4, 5, 6, 7, 8];
        const spellCards = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122];
        const testDeck = [...unitCards, ...spellCards];
        cardManager.playerDeck = cardManager.createDeck(testDeck);
        cardManager.opponentDeck = cardManager.createDeck(testDeck);
        cardManager.opponent2Deck = cardManager.createDeck(testDeck);

        for (let i = 0; i < 5; i++) {
            const card = cardManager.playerDeck.shift();
            cardManager.addToHand(card, true);
            const opponentCard = cardManager.opponentDeck.shift();
            cardManager.addToHand(opponentCard, false);
            const opponent2Card = cardManager.opponent2Deck.shift();
            cardManager.addToHand(opponent2Card, false, 2);
        }

        this.updateUI1v1v1();
        this.renderHand1v1v1();
        this.setupCardClickHandlers1v1v1();
    }

    renderHandAI() {
        const playerHandEl = document.getElementById('player-hand-ai');
        const opponentHandEl = document.getElementById('opponent-hand-ai');
        playerHandEl.innerHTML = '';
        opponentHandEl.innerHTML = '';

        cardManager.playerHand.forEach(card => {
            const cardEl = cardManager.renderCard(card, false);
            playerHandEl.appendChild(cardEl);
        });

        cardManager.opponentHand.forEach((card) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card card-back';
            cardEl.dataset.instanceId = card.instanceId;
            cardEl.innerHTML = '🂠';
            opponentHandEl.appendChild(cardEl);
        });
    }

    renderHand1v1() {
        const playerHandEl = document.getElementById('player-hand-1v1');
        const opponentHandEl = document.getElementById('opponent-hand-1v1');
        playerHandEl.innerHTML = '';
        opponentHandEl.innerHTML = '';

        cardManager.playerHand.forEach(card => {
            const cardEl = cardManager.renderCard(card, false);
            playerHandEl.appendChild(cardEl);
        });

        cardManager.opponentHand.forEach((card) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card card-back';
            cardEl.dataset.instanceId = card.instanceId;
            cardEl.innerHTML = '🂠';
            opponentHandEl.appendChild(cardEl);
        });
    }

    renderHand1v1v1() {
        const playerHandEl = document.getElementById('player-hand-1v1v1');
        const opponent1HandEl = document.getElementById('opponent1-hand');
        const opponent2HandEl = document.getElementById('opponent2-hand');
        playerHandEl.innerHTML = '';
        opponent1HandEl.innerHTML = '';
        opponent2HandEl.innerHTML = '';

        cardManager.playerHand.forEach(card => {
            const cardEl = cardManager.renderCard(card, false);
            playerHandEl.appendChild(cardEl);
        });

        cardManager.opponentHand.forEach((card) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card card-back';
            cardEl.dataset.instanceId = card.instanceId;
            cardEl.innerHTML = '🂠';
            opponent1HandEl.appendChild(cardEl);
        });

        cardManager.opponent2Hand.forEach((card) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card card-back';
            cardEl.dataset.instanceId = card.instanceId;
            cardEl.innerHTML = '🂠';
            opponent2HandEl.appendChild(cardEl);
        });
    }

    setupCardClickHandlersAI() {
        const playerHandEl = document.getElementById('player-hand-ai');
        playerHandEl.addEventListener('click', (e) => {
            const cardEl = e.target.closest('.card');
            if (cardEl && !cardEl.classList.contains('card-back')) {
                const instanceId = cardEl.dataset.instanceId;
                const card = cardManager.playerHand.find(c => c.instanceId === instanceId);
                if (card) this.selectCard(card);
            }
        });
    }

    setupCardClickHandlers1v1() {
        const playerHandEl = document.getElementById('player-hand-1v1');
        playerHandEl.addEventListener('click', (e) => {
            const cardEl = e.target.closest('.card');
            if (cardEl && !cardEl.classList.contains('card-back')) {
                const instanceId = cardEl.dataset.instanceId;
                const card = cardManager.playerHand.find(c => c.instanceId === instanceId);
                if (card) this.selectCard(card);
            }
        });
    }

    setupCardClickHandlers1v1v1() {
        const playerHandEl = document.getElementById('player-hand-1v1v1');
        playerHandEl.addEventListener('click', (e) => {
            const cardEl = e.target.closest('.card');
            if (cardEl && !cardEl.classList.contains('card-back')) {
                const instanceId = cardEl.dataset.instanceId;
                const card = cardManager.playerHand.find(c => c.instanceId === instanceId);
                if (card) this.selectCard(card);
            }
        });
    }

    selectCard(card) {
        if (this.currentTurn !== 'player') {
            showToast('상대방의 턴입니다', 'warning');
            return;
        }

        if (card.type === 'unit') {
            if (this.playerMana >= card.cost) {
                this.playCard(card);
            } else {
                showToast('마나가 부족합니다', 'warning');
            }
        } else if (card.type === 'spell') {
            if (this.playerMana >= card.cost) {
                this.castSpell(card);
            } else {
                showToast('마나가 부족합니다', 'warning');
            }
        }
    }

    playCard(card) {
        cardManager.removeFromHand(card.instanceId, true);
        cardManager.addToField(card, true);
        this.playerMana -= card.cost;
        this.updateUI();
        this.renderHand();
        showToast(`${card.name}을(를) 배치했습니다`, 'success');
    }

    castSpell(card) {
        cardManager.removeFromHand(card.instanceId, true);
        this.playerMana -= card.cost;
        this.applySpellEffect(card, false);
        this.updateUI();
        this.renderHand();
        showToast(`${card.name}을(를) 시전했습니다`, 'success');
    }

    applySpellEffect(spell, isOpponent = false) {
        switch (spell.effect) {
            case 'heal':
                if (isOpponent) {
                    this.opponentHealth = Math.min(this.opponentHealth + spell.value, 100);
                    showToast(`${spell.icon} AI가 ${spell.value} 체력 회복!`, 'info');
                } else {
                    this.playerHealth = Math.min(this.playerHealth + spell.value, 100);
                    showToast(`${spell.icon} ${spell.value} 체력 회복!`, 'success');
                }
                break;
            case 'damage':
                if (isOpponent) {
                    this.playerHealth -= spell.value;
                    showToast(`${spell.icon} AI가 당신에게 ${spell.value} 피해!`, 'warning');
                } else {
                    this.opponentHealth -= spell.value;
                    showToast(`${spell.icon} 상대방에게 ${spell.value} 피해!`, 'success');
                }
                break;
            case 'aoe_damage':
                if (isOpponent) {
                    this.playerHealth -= spell.value;
                    showToast(`${spell.icon} AI의 광역 공격! ${spell.value} 피해!`, 'warning');
                } else {
                    this.opponentHealth -= spell.value;
                    showToast(`${spell.icon} 모든 적에게 ${spell.value} 피해!`, 'success');
                }
                break;
        }
    }

    endTurn() {
        if (this.currentTurn !== 'player') {
            showToast('현재 턴이 아닙니다', 'warning');
            return;
        }

        this.currentTurn = 'opponent';
        this.updateUI();
        showToast('상대방의 턴입니다', 'info');
        setTimeout(() => this.opponentTurn(), 1500);
    }

    opponentTurn() {
        this.opponentMana = Math.min(this.opponentMana + 1, this.maxOpponentMana);
        const playableCards = cardManager.opponentHand.filter(card => card.cost <= this.opponentMana);
        
        if (playableCards.length > 0) {
            const unitCards = playableCards.filter(c => c.type === 'unit');
            const spellCards = playableCards.filter(c => c.type === 'spell');
            let cardToPlay = null;
            
            if (unitCards.length > 0 && Math.random() > 0.5) {
                cardToPlay = unitCards[Math.floor(Math.random() * unitCards.length)];
            } else if (spellCards.length > 0) {
                cardToPlay = spellCards[Math.floor(Math.random() * spellCards.length)];
            } else if (unitCards.length > 0) {
                cardToPlay = unitCards[Math.floor(Math.random() * unitCards.length)];
            }
            
            if (cardToPlay) {
                cardManager.removeFromHand(cardToPlay.instanceId, false);
                if (cardToPlay.type === 'unit') {
                    cardManager.addToField(cardToPlay, false);
                } else {
                    this.applySpellEffect(cardToPlay, true);
                }
                this.opponentMana -= cardToPlay.cost;
            }
        }

        this.currentTurn = 'player';
        this.playerMana = Math.min(this.playerMana + 1, this.maxMana);
        this.updateUI();
        this.renderHand();
        showToast('당신의 턴입니다', 'info');
    }

    surrender() {
        if (confirm('정말 항복하시겠습니까?')) {
            this.endGame(false);
        }
    }

    backToMenu() {
        if (confirm('게임을 종료하시겠습니까?')) {
            this.endGame(false);
        }
    }

    endGame(playerWon) {
        this.gameActive = false;
        if (this.gameMode === 'ai') {
            document.getElementById('game-ai-screen').classList.remove('active');
        } else if (this.gameMode === '1v1') {
            document.getElementById('game-1v1-screen').classList.remove('active');
        } else {
            document.getElementById('game-1v1v1-screen').classList.remove('active');
        }
        document.getElementById('main-screen').classList.add('active');
        
        if (playerWon) {
            showToast('승리했습니다!', 'success');
        } else {
            showToast('게임이 종료되었습니다', 'warning');
        }
    }

    updateUI() {
        if (this.gameMode === 'ai') {
            this.updateUIAI();
        } else if (this.gameMode === '1v1') {
            this.updateUI1v1();
        } else {
            this.updateUI1v1v1();
        }
    }

    renderHand() {
        if (this.gameMode === 'ai') {
            this.renderHandAI();
        } else if (this.gameMode === '1v1') {
            this.renderHand1v1();
        } else {
            this.renderHand1v1v1();
        }
    }

    updateUIAI() {
        document.getElementById('player-health-ai').style.width = `${(this.playerHealth / 100) * 100}%`;
        document.getElementById('player-health-text-ai').textContent = `${this.playerHealth}/100`;
        document.getElementById('opponent-health-ai').style.width = `${(this.opponentHealth / 100) * 100}%`;
        document.getElementById('opponent-health-text-ai').textContent = `${this.opponentHealth}/100`;
        
        const turnText = this.currentTurn === 'player' ? '당신의 턴' : 'AI의 턴';
        document.getElementById('turn-indicator-ai').textContent = turnText;

        if (this.playerHealth <= 0) {
            this.endGame(false);
        } else if (this.opponentHealth <= 0) {
            this.endGame(true);
        }
    }

    updateUI1v1() {
        document.getElementById('player-health-1v1').style.width = `${(this.playerHealth / 100) * 100}%`;
        document.getElementById('player-health-text-1v1').textContent = `${this.playerHealth}/100`;
        document.getElementById('opponent-health-1v1').style.width = `${(this.opponentHealth / 100) * 100}%`;
        document.getElementById('opponent-health-text-1v1').textContent = `${this.opponentHealth}/100`;
        
        const turnText = this.currentTurn === 'player' ? '당신의 턴' : '상대방의 턴';
        document.getElementById('turn-indicator-1v1').textContent = turnText;

        if (this.playerHealth <= 0) {
            this.endGame(false);
        } else if (this.opponentHealth <= 0) {
            this.endGame(true);
        }
    }

    updateUI1v1v1() {
        document.getElementById('player-health-1v1v1').style.width = `${(this.playerHealth / 100) * 100}%`;
        document.getElementById('player-health-text-1v1v1').textContent = `${this.playerHealth}/100`;
        document.getElementById('opponent1-health').style.width = `${(this.opponentHealth / 100) * 100}%`;
        document.getElementById('opponent1-health-text').textContent = `${this.opponentHealth}/100`;
        document.getElementById('opponent2-health').style.width = `${(this.opponent2Health / 100) * 100}%`;
        document.getElementById('opponent2-health-text').textContent = `${this.opponent2Health}/100`;
        
        const turnText = this.currentTurn === 'player' ? '당신의 턴' : '상대방의 턴';
        document.getElementById('turn-indicator-1v1v1').textContent = turnText;

        if (this.playerHealth <= 0) {
            this.endGame(false);
        }
    }

    showDeckBuilder() {
        showModal('덱 편성', '덱 편성 기능은 준비 중입니다');
    }

    showInventory() {
        showModal('인벤토리', '인벤토리 기능은 준비 중입니다');
    }

    showStats() {
        showModal('통계', '통계 기능은 준비 중입니다');
    }
}

const gameManager = new GameManager();
