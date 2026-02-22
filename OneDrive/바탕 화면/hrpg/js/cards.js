// 카드 데이터 및 관리 - 얼굴 이모지 유닛 + 음식 이모지 스펠
const CARD_DATABASE = {
    // 유닛 카드 (얼굴 이모지 - ID 1-8)
    1: {
        id: 1,
        name: '웃는 전사',
        icon: '😊',
        type: 'unit',
        cost: 2,
        attack: 2,
        defense: 1,
        hp: 3,
        rarity: 'common',
        description: '기본 공격 유닛',
        ability: 'basic_attack',
    },
    2: {
        id: 2,
        name: '화난 궁수',
        icon: '😠',
        type: 'unit',
        cost: 3,
        attack: 3,
        defense: 0,
        hp: 2,
        rarity: 'common',
        description: '높은 공격력, 매 턴 상대 방어력 -1',
        ability: 'angry_shot',
    },
    3: {
        id: 3,
        name: '멋진 기사',
        icon: '😎',
        type: 'unit',
        cost: 4,
        attack: 2,
        defense: 3,
        hp: 5,
        rarity: 'uncommon',
        description: '높은 방어력, 피해 받을 때 체력 1 회복',
        ability: 'cool_shield',
    },
    4: {
        id: 4,
        name: '똑똑한 마법사',
        icon: '🤓',
        type: 'unit',
        cost: 4,
        attack: 4,
        defense: 1,
        hp: 3,
        rarity: 'uncommon',
        description: '강력한 마법 공격, 공격 시 상대 마나 -1',
        ability: 'smart_drain',
    },
    5: {
        id: 5,
        name: '왕 용사',
        icon: '👑',
        type: 'unit',
        cost: 6,
        attack: 5,
        defense: 2,
        hp: 6,
        rarity: 'rare',
        description: '전설의 용사, 공격 시 모든 적 유닛에 1 피해',
        ability: 'king_explosion',
    },
    6: {
        id: 6,
        name: '천사 기사',
        icon: '😇',
        type: 'unit',
        cost: 3,
        attack: 1,
        defense: 2,
        hp: 4,
        rarity: 'common',
        description: '방어 특화, 아군 유닛 방어력 +1',
        ability: 'angel_buff',
    },
    7: {
        id: 7,
        name: '악마 마스터',
        icon: '😈',
        type: 'unit',
        cost: 5,
        attack: 3,
        defense: 2,
        hp: 4,
        rarity: 'uncommon',
        description: '필드에 있을 때마다 매 턴 상대 체력 -1',
        ability: 'demon_poison',
    },
    8: {
        id: 8,
        name: '행복한 전사',
        icon: '😄',
        type: 'unit',
        cost: 3,
        attack: 2,
        defense: 1,
        hp: 3,
        rarity: 'common',
        description: '공격 시 자신 체력 1 회복',
        ability: 'happy_heal',
    },

    // 스펠 카드 (음식 이모지 - ID 101-150)
    101: { id: 101, name: '🍞 토스트 치유', icon: '🍞', type: 'spell', cost: 2, effect: 'heal', value: 5, rarity: 'common', description: '아군 체력 5 회복', ability: 'toast_heal' },
    102: { id: 102, name: '🧈 버터 폭탄', icon: '🧈', type: 'spell', cost: 3, effect: 'damage', value: 5, rarity: 'common', description: '적군에게 5 피해', ability: 'butter_bomb' },
    103: { id: 103, name: '🍓 잼 방어막', icon: '🍓', type: 'spell', cost: 2, effect: 'shield', value: 3, rarity: 'uncommon', description: '아군 방어력 3 증가 (2턴)', ability: 'jam_barrier' },
    104: { id: 104, name: '🍯 꿀 강화', icon: '🍯', type: 'spell', cost: 3, effect: 'buff', value: 2, rarity: 'uncommon', description: '아군 모든 유닛 공격력 +2 (1턴)', ability: 'honey_boost' },
    105: { id: 105, name: '🥚 계란 폭발', icon: '🥚', type: 'spell', cost: 4, effect: 'aoe_damage', value: 3, rarity: 'rare', description: '모든 적 유닛에게 3 피해', ability: 'egg_burst' },
    106: { id: 106, name: '🥛 우유 회복', icon: '🥛', type: 'spell', cost: 2, effect: 'heal_all', value: 2, rarity: 'uncommon', description: '아군 모든 유닛 체력 2 회복', ability: 'milk_recovery' },
    107: { id: 107, name: '🧀 치즈 독', icon: '🧀', type: 'spell', cost: 3, effect: 'poison', value: 2, rarity: 'uncommon', description: '적 유닛에게 2턴간 매 턴 1 피해', ability: 'cheese_toxin' },
    108: { id: 108, name: '🥞 팬케이크 재생', icon: '🥞', type: 'spell', cost: 3, effect: 'regenerate', value: 1, rarity: 'uncommon', description: '아군 유닛 매 턴 1 체력 회복 (3턴)', ability: 'pancake_regen' },
    109: { id: 109, name: '🍕 피자 강화', icon: '🍕', type: 'spell', cost: 2, effect: 'buff', value: 1, rarity: 'common', description: '아군 유닛 공격력 +1', ability: 'pizza_buff' },
    110: { id: 110, name: '🍔 햄버거 회복', icon: '🍔', type: 'spell', cost: 2, effect: 'heal', value: 4, rarity: 'common', description: '아군 체력 4 회복', ability: 'burger_heal' },
    111: { id: 111, name: '🌮 타코 공격', icon: '🌮', type: 'spell', cost: 2, effect: 'damage', value: 3, rarity: 'common', description: '적군에게 3 피해', ability: 'taco_damage' },
    112: { id: 112, name: '🍜 라면 강화', icon: '🍜', type: 'spell', cost: 3, effect: 'buff', value: 3, rarity: 'uncommon', description: '아군 모든 유닛 방어력 +1', ability: 'ramen_defense' },
    113: { id: 113, name: '🍱 도시락 회복', icon: '🍱', type: 'spell', cost: 3, effect: 'heal_all', value: 3, rarity: 'uncommon', description: '아군 모든 유닛 체력 3 회복', ability: 'bento_recovery' },
    114: { id: 114, name: '🍛 카레 공격', icon: '🍛', type: 'spell', cost: 3, effect: 'aoe_damage', value: 2, rarity: 'uncommon', description: '모든 적 유닛에게 2 피해', ability: 'curry_aoe' },
    115: { id: 115, name: '🍝 스파게티 독', icon: '🍝', type: 'spell', cost: 2, effect: 'poison', value: 1, rarity: 'common', description: '적 유닛에게 독 부여', ability: 'pasta_poison' },
    116: { id: 116, name: '🥩 스테이크 강화', icon: '🥩', type: 'spell', cost: 4, effect: 'buff', value: 4, rarity: 'rare', description: '아군 모든 유닛 공격력 +3 (1턴)', ability: 'steak_boost' },
    117: { id: 117, name: '🍖 치킨 회복', icon: '🍖', type: 'spell', cost: 2, effect: 'heal', value: 6, rarity: 'uncommon', description: '아군 체력 6 회복', ability: 'chicken_heal' },
    118: { id: 118, name: '🌭 핫도그 공격', icon: '🌭', type: 'spell', cost: 2, effect: 'damage', value: 4, rarity: 'common', description: '적군에게 4 피해', ability: 'hotdog_damage' },
    119: { id: 119, name: '🥓 베이컨 강화', icon: '🥓', type: 'spell', cost: 2, effect: 'buff', value: 2, rarity: 'common', description: '아군 유닛 공격력 +2', ability: 'bacon_buff' },
    120: { id: 120, name: '🥞 팬케이크 방어', icon: '🥞', type: 'spell', cost: 2, effect: 'shield', value: 2, rarity: 'common', description: '아군 방어력 2 증가', ability: 'pancake_shield' },
    121: { id: 121, name: '🍎 사과 회복', icon: '🍎', type: 'spell', cost: 1, effect: 'heal', value: 2, rarity: 'common', description: '아군 체력 2 회복', ability: 'apple_heal' },
    122: { id: 122, name: '🍊 오렌지 강화', icon: '🍊', type: 'spell', cost: 2, effect: 'buff', value: 1, rarity: 'common', description: '아군 유닛 공격력 +1', ability: 'orange_buff' },
    123: { id: 123, name: '🍋 레몬 공격', icon: '🍋', type: 'spell', cost: 2, effect: 'damage', value: 3, rarity: 'common', description: '적군에게 3 피해', ability: 'lemon_damage' },
    124: { id: 124, name: '🍌 바나나 회복', icon: '🍌', type: 'spell', cost: 2, effect: 'heal', value: 3, rarity: 'common', description: '아군 체력 3 회복', ability: 'banana_heal' },
    125: { id: 125, name: '🍉 수박 방어', icon: '🍉', type: 'spell', cost: 2, effect: 'shield', value: 2, rarity: 'common', description: '아군 방어력 2 증가', ability: 'watermelon_shield' },
    126: { id: 126, name: '🍇 포도 독', icon: '🍇', type: 'spell', cost: 2, effect: 'poison', value: 1, rarity: 'common', description: '적 유닛에게 독 부여', ability: 'grape_poison' },
    127: { id: 127, name: '🍓 딸기 강화', icon: '🍓', type: 'spell', cost: 2, effect: 'buff', value: 1, rarity: 'common', description: '아군 유닛 공격력 +1', ability: 'strawberry_buff' },
    128: { id: 128, name: '🍒 체리 공격', icon: '🍒', type: 'spell', cost: 2, effect: 'damage', value: 2, rarity: 'common', description: '적군에게 2 피해', ability: 'cherry_damage' },
    129: { id: 129, name: '🍑 복숭아 회복', icon: '🍑', type: 'spell', cost: 2, effect: 'heal', value: 3, rarity: 'common', description: '아군 체력 3 회복', ability: 'peach_heal' },
    130: { id: 130, name: '🥝 키위 방어', icon: '🥝', type: 'spell', cost: 2, effect: 'shield', value: 1, rarity: 'common', description: '아군 방어력 1 증가', ability: 'kiwi_shield' },
    131: { id: 131, name: '🍍 파인애플 공격', icon: '🍍', type: 'spell', cost: 3, effect: 'aoe_damage', value: 2, rarity: 'uncommon', description: '모든 적 유닛에게 2 피해', ability: 'pineapple_aoe' },
    132: { id: 132, name: '🥥 코코넛 회복', icon: '🥥', type: 'spell', cost: 3, effect: 'heal_all', value: 2, rarity: 'uncommon', description: '아군 모든 유닛 체력 2 회복', ability: 'coconut_recovery' },
    133: { id: 133, name: '🍰 케이크 회복', icon: '🍰', type: 'spell', cost: 3, effect: 'heal', value: 7, rarity: 'uncommon', description: '아군 체력 7 회복', ability: 'cake_heal' },
    134: { id: 134, name: '🎂 생일케이크 강화', icon: '🎂', type: 'spell', cost: 4, effect: 'buff', value: 3, rarity: 'rare', description: '아군 모든 유닛 공격력 +2 (2턴)', ability: 'birthday_boost' },
    135: { id: 135, name: '🍪 쿠키 방어', icon: '🍪', type: 'spell', cost: 2, effect: 'shield', value: 2, rarity: 'common', description: '아군 방어력 2 증가', ability: 'cookie_shield' },
    136: { id: 136, name: '🍩 도넛 회복', icon: '🍩', type: 'spell', cost: 2, effect: 'heal', value: 4, rarity: 'common', description: '아군 체력 4 회복', ability: 'donut_heal' },
    137: { id: 137, name: '🍫 초콜릿 강화', icon: '🍫', type: 'spell', cost: 2, effect: 'buff', value: 2, rarity: 'common', description: '아군 유닛 공격력 +2', ability: 'chocolate_buff' },
    138: { id: 138, name: '🍬 사탕 회복', icon: '🍬', type: 'spell', cost: 1, effect: 'heal', value: 1, rarity: 'common', description: '아군 체력 1 회복', ability: 'candy_heal' },
    139: { id: 139, name: '🍭 롤리팝 방어', icon: '🍭', type: 'spell', cost: 1, effect: 'shield', value: 1, rarity: 'common', description: '아군 방어력 1 증가', ability: 'lollipop_shield' },
    140: { id: 140, name: '🍮 푸딩 회복', icon: '🍮', type: 'spell', cost: 2, effect: 'heal', value: 3, rarity: 'common', description: '아군 체력 3 회복', ability: 'pudding_heal' },
    141: { id: 141, name: '🍯 꿀 회복', icon: '🍯', type: 'spell', cost: 2, effect: 'heal', value: 4, rarity: 'common', description: '아군 체력 4 회복', ability: 'honey_heal' },
    142: { id: 142, name: '🍼 우유병 회복', icon: '🍼', type: 'spell', cost: 2, effect: 'heal_all', value: 1, rarity: 'common', description: '아군 모든 유닛 체력 1 회복', ability: 'bottle_recovery' },
    143: { id: 143, name: '☕ 커피 강화', icon: '☕', type: 'spell', cost: 2, effect: 'buff', value: 1, rarity: 'common', description: '아군 유닛 공격력 +1', ability: 'coffee_buff' },
    144: { id: 144, name: '🍵 차 방어', icon: '🍵', type: 'spell', cost: 2, effect: 'shield', value: 1, rarity: 'common', description: '아군 방어력 1 증가', ability: 'tea_shield' },
    145: { id: 145, name: '🍶 사케 공격', icon: '🍶', type: 'spell', cost: 3, effect: 'damage', value: 5, rarity: 'uncommon', description: '적군에게 5 피해', ability: 'sake_damage' },
    146: { id: 146, name: '🍾 샴페인 강화', icon: '🍾', type: 'spell', cost: 3, effect: 'buff', value: 2, rarity: 'uncommon', description: '아군 모든 유닛 공격력 +1 (2턴)', ability: 'champagne_boost' },
    147: { id: 147, name: '🍷 와인 회복', icon: '🍷', type: 'spell', cost: 3, effect: 'heal', value: 6, rarity: 'uncommon', description: '아군 체력 6 회복', ability: 'wine_heal' },
    148: { id: 148, name: '🍸 칵테일 공격', icon: '🍸', type: 'spell', cost: 2, effect: 'damage', value: 4, rarity: 'common', description: '적군에게 4 피해', ability: 'cocktail_damage' },
    149: { id: 149, name: '🍹 트로피컬 회복', icon: '🍹', type: 'spell', cost: 2, effect: 'heal', value: 5, rarity: 'uncommon', description: '아군 체력 5 회복', ability: 'tropical_heal' },
    150: { id: 150, name: '🍺 맥주 강화', icon: '🍺', type: 'spell', cost: 3, effect: 'buff', value: 3, rarity: 'uncommon', description: '아군 모든 유닛 공격력 +2 (1턴)', ability: 'beer_boost' },
};

class CardManager {
    constructor() {
        this.playerHand = [];
        this.playerField = [];
        this.opponentHand = [];
        this.opponentField = [];
        this.opponent2Hand = [];
        this.opponent2Field = [];
        this.playerDeck = [];
        this.opponentDeck = [];
        this.opponent2Deck = [];
    }

    // 카드 생성
    createCard(cardId, instanceId = null) {
        const cardData = CARD_DATABASE[cardId];
        if (!cardData) throw new Error(`Card ${cardId} not found`);

        return {
            ...cardData,
            instanceId: instanceId || this.generateInstanceId(),
            currentHp: cardData.hp || 0,
        };
    }

    generateInstanceId() {
        return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // 덱 생성
    createDeck(cardIds) {
        if (cardIds.length !== 30) {
            throw new Error('덱은 정확히 30장이어야 합니다');
        }

        return cardIds.map(id => this.createCard(id));
    }

    // 손패에 카드 추가
    addToHand(card, isPlayer = true, opponentNum = 1) {
        if (isPlayer) {
            this.playerHand.push(card);
        } else if (opponentNum === 2) {
            this.opponent2Hand.push(card);
        } else {
            this.opponentHand.push(card);
        }
    }

    // 손패에서 카드 제거
    removeFromHand(instanceId, isPlayer = true, opponentNum = 1) {
        let hand;
        if (isPlayer) {
            hand = this.playerHand;
        } else if (opponentNum === 2) {
            hand = this.opponent2Hand;
        } else {
            hand = this.opponentHand;
        }
        
        const index = hand.findIndex(c => c.instanceId === instanceId);
        if (index !== -1) {
            return hand.splice(index, 1)[0];
        }
        return null;
    }

    // 필드에 카드 배치
    addToField(card, isPlayer = true, opponentNum = 1) {
        if (isPlayer) {
            this.playerField.push(card);
        } else if (opponentNum === 2) {
            this.opponent2Field.push(card);
        } else {
            this.opponentField.push(card);
        }
    }

    // 필드에서 카드 제거
    removeFromField(instanceId, isPlayer = true, opponentNum = 1) {
        let field;
        if (isPlayer) {
            field = this.playerField;
        } else if (opponentNum === 2) {
            field = this.opponent2Field;
        } else {
            field = this.opponentField;
        }
        
        const index = field.findIndex(c => c.instanceId === instanceId);
        if (index !== -1) {
            return field.splice(index, 1)[0];
        }
        return null;
    }

    // 카드 렌더링
    renderCard(card, isOpponent = false) {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.dataset.instanceId = card.instanceId;
        cardEl.title = card.description;

        if (card.type === 'unit') {
            cardEl.innerHTML = `
                <div class="card-icon">${card.icon}</div>
                <div class="card-name">${card.name}</div>
                <div class="card-stats">
                    <div class="card-stat">
                        <div class="card-stat-label">공</div>
                        <div class="card-stat-value">${card.attack}</div>
                    </div>
                    <div class="card-stat">
                        <div class="card-stat-label">방</div>
                        <div class="card-stat-value">${card.defense}</div>
                    </div>
                    <div class="card-stat">
                        <div class="card-stat-label">체</div>
                        <div class="card-stat-value">${card.currentHp}/${card.hp}</div>
                    </div>
                </div>
                <div class="card-cost">${card.cost}</div>
            `;
        } else if (card.type === 'spell') {
            cardEl.innerHTML = `
                <div class="card-icon">${card.icon}</div>
                <div class="card-name">${card.name}</div>
                <div class="card-effect">${card.effect}</div>
                <div class="card-cost">${card.cost}</div>
            `;
        }

        if (isOpponent) {
            cardEl.style.opacity = '0.6';
        }

        return cardEl;
    }

    // 손패 렌더링
    renderHand(isPlayer = true) {
        const handContainer = isPlayer 
            ? document.getElementById('player-hand')
            : document.getElementById('opponent-hand');
        
        const hand = isPlayer ? this.playerHand : this.opponentHand;
        
        handContainer.innerHTML = '';
        hand.forEach(card => {
            const cardEl = this.renderCard(card, !isPlayer);
            handContainer.appendChild(cardEl);
        });
    }

    // 필드 렌더링
    renderField(isPlayer = true) {
        const fieldContainer = isPlayer
            ? document.getElementById('player-field')
            : document.getElementById('opponent-field');
        
        const field = isPlayer ? this.playerField : this.opponentField;
        
        fieldContainer.innerHTML = '';
        field.forEach(card => {
            const cardEl = this.renderCard(card, !isPlayer);
            fieldContainer.appendChild(cardEl);
        });
    }

    // 전체 렌더링
    render() {
        this.renderHand(true);
        this.renderHand(false);
        this.renderField(true);
        this.renderField(false);
    }

    // 카드 정보 조회
    getCard(cardId) {
        return CARD_DATABASE[cardId];
    }

    // 모든 카드 조회
    getAllCards() {
        return Object.values(CARD_DATABASE);
    }

    // 카드 필터링
    filterCards(predicate) {
        return Object.values(CARD_DATABASE).filter(predicate);
    }
}

const cardManager = new CardManager();
