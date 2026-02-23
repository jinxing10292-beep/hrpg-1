// 로컬 스토리지 기반 인증 클라이언트
class LocalAuthClient {
    constructor() {
        this.session = null;
        this.loadSession();
    }

    loadSession() {
        const savedSession = localStorage.getItem('auth_session');
        if (savedSession) {
            this.session = JSON.parse(savedSession);
        }
    }

    saveSession() {
        if (this.session) {
            localStorage.setItem('auth_session', JSON.stringify(this.session));
        }
    }

    async signUp(email, password, username) {
        // 이메일 중복 확인
        const existingUser = localStorage.getItem(`user_${email}`);
        if (existingUser) {
            throw new Error('이미 가입된 이메일입니다');
        }

        // 새 사용자 생성
        const userId = `user_${Date.now()}`;
        const user = {
            id: userId,
            email,
            password, // 실제 환경에서는 해시 처리 필요
            username,
            level: 1,
            experience: 0,
            gold: 0,
            created_at: new Date().toISOString(),
        };

        localStorage.setItem(`user_${email}`, JSON.stringify(user));
        localStorage.setItem(`profile_${userId}`, JSON.stringify(user));

        this.session = {
            user: user,
            access_token: userId,
        };
        this.saveSession();

        return { user: user, session: this.session };
    }

    async signIn(email, password) {
        const userStr = localStorage.getItem(`user_${email}`);
        if (!userStr) {
            throw new Error('가입되지 않은 이메일입니다');
        }

        const user = JSON.parse(userStr);
        if (user.password !== password) {
            throw new Error('비밀번호가 일치하지 않습니다');
        }

        this.session = {
            user: user,
            access_token: user.id,
        };
        this.saveSession();

        return { user: user, session: this.session };
    }

    async signOut() {
        this.session = null;
        localStorage.removeItem('auth_session');
    }

    // 프로필 관련
    async getProfile(userId) {
        const profileStr = localStorage.getItem(`profile_${userId}`);
        if (profileStr) {
            return JSON.parse(profileStr);
        }
        return null;
    }

    async updateProfile(userId, updates) {
        const profile = await this.getProfile(userId);
        if (profile) {
            const updated = { ...profile, ...updates };
            localStorage.setItem(`profile_${userId}`, JSON.stringify(updated));
            return updated;
        }
        return null;
    }

    // 게임 데이터 관련
    async saveGameState(userId, gameState) {
        const key = `gamestate_${userId}_${Date.now()}`;
        localStorage.setItem(key, JSON.stringify(gameState));
        return { id: key };
    }

    async getGameState(userId) {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(`gamestate_${userId}`));
        if (keys.length > 0) {
            const lastKey = keys[keys.length - 1];
            return JSON.parse(localStorage.getItem(lastKey));
        }
        return null;
    }

    // 덱 관련
    async saveDeck(userId, deckName, cards) {
        const deckId = `deck_${userId}_${Date.now()}`;
        const deck = {
            id: deckId,
            user_id: userId,
            name: deckName,
            cards,
            created_at: new Date().toISOString(),
        };
        localStorage.setItem(deckId, JSON.stringify(deck));
        return deck;
    }

    async getDecks(userId) {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(`deck_${userId}`));
        return keys.map(k => JSON.parse(localStorage.getItem(k)));
    }

    async updateDeck(deckId, updates) {
        const deckStr = localStorage.getItem(deckId);
        if (deckStr) {
            const deck = JSON.parse(deckStr);
            const updated = { ...deck, ...updates };
            localStorage.setItem(deckId, JSON.stringify(updated));
            return updated;
        }
        return null;
    }

    // 인벤토리 관련
    async getInventory(userId) {
        const inventoryStr = localStorage.getItem(`inventory_${userId}`);
        if (inventoryStr) {
            return JSON.parse(inventoryStr);
        }
        return [];
    }

    async addToInventory(userId, cardId, quantity = 1) {
        const inventory = await this.getInventory(userId);
        const existing = inventory.find(item => item.card_id === cardId);
        
        if (existing) {
            existing.quantity += quantity;
        } else {
            inventory.push({
                id: `inv_${Date.now()}`,
                user_id: userId,
                card_id: cardId,
                quantity,
                created_at: new Date().toISOString(),
            });
        }
        
        localStorage.setItem(`inventory_${userId}`, JSON.stringify(inventory));
        return inventory;
    }

    // 게임 매치 관련
    async createMatch(userId, opponentId) {
        const matchId = `match_${Date.now()}`;
        const match = {
            id: matchId,
            player1_id: userId,
            player2_id: opponentId,
            status: 'active',
            created_at: new Date().toISOString(),
        };
        localStorage.setItem(matchId, JSON.stringify(match));
        return match;
    }

    async getActiveMatches(userId) {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('match_'));
        return keys
            .map(k => JSON.parse(localStorage.getItem(k)))
            .filter(m => (m.player1_id === userId || m.player2_id === userId) && m.status === 'active');
    }

    async updateMatch(matchId, updates) {
        const matchStr = localStorage.getItem(matchId);
        if (matchStr) {
            const match = JSON.parse(matchStr);
            const updated = { ...match, ...updates };
            localStorage.setItem(matchId, JSON.stringify(updated));
            return updated;
        }
        return null;
    }

    // 통계 관련
    async getStats(userId) {
        const statsStr = localStorage.getItem(`stats_${userId}`);
        if (statsStr) {
            return JSON.parse(statsStr);
        }
        return {
            user_id: userId,
            wins: 0,
            losses: 0,
            total_matches: 0,
        };
    }

    async updateStats(userId, updates) {
        const stats = await this.getStats(userId);
        const updated = { ...stats, ...updates };
        localStorage.setItem(`stats_${userId}`, JSON.stringify(updated));
        return updated;
    }
}

// 전역 클라이언트
const supabase = new LocalAuthClient();
