// Supabase 클라이언트 초기화
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

class SupabaseClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
        this.session = null;
    }

    async request(endpoint, options = {}) {
        const url = `${this.url}/rest/v1${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'apikey': this.key,
            ...options.headers,
        };

        if (this.session?.access_token) {
            headers['Authorization'] = `Bearer ${this.session.access_token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API Error');
        }

        return response.json();
    }

    // 인증 관련
    async signUp(email, password, username) {
        const response = await fetch(`${this.url}/auth/v1/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': this.key,
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error_description || 'Sign up failed');

        this.session = data.session;
        
        // 프로필 생성
        await this.createProfile(data.user.id, username, email);
        
        return data;
    }

    async signIn(email, password) {
        const response = await fetch(`${this.url}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': this.key,
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error_description || 'Sign in failed');

        this.session = data;
        return data;
    }

    async signOut() {
        this.session = null;
    }

    // 프로필 관련
    async createProfile(userId, username, email) {
        return this.request('/profiles', {
            method: 'POST',
            body: JSON.stringify({
                id: userId,
                username,
                email,
                level: 1,
                experience: 0,
                gold: 0,
                created_at: new Date().toISOString(),
            }),
        });
    }

    async getProfile(userId) {
        const data = await this.request(`/profiles?id=eq.${userId}`);
        return data[0];
    }

    async updateProfile(userId, updates) {
        return this.request(`/profiles?id=eq.${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
    }

    // 게임 데이터 관련
    async saveGameState(userId, gameState) {
        return this.request('/game_states', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                state: gameState,
                created_at: new Date().toISOString(),
            }),
        });
    }

    async getGameState(userId) {
        const data = await this.request(`/game_states?user_id=eq.${userId}&order=created_at.desc&limit=1`);
        return data[0];
    }

    // 덱 관련
    async saveDeck(userId, deckName, cards) {
        return this.request('/decks', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                name: deckName,
                cards,
                created_at: new Date().toISOString(),
            }),
        });
    }

    async getDecks(userId) {
        return this.request(`/decks?user_id=eq.${userId}`);
    }

    async updateDeck(deckId, updates) {
        return this.request(`/decks?id=eq.${deckId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
    }

    // 인벤토리 관련
    async getInventory(userId) {
        return this.request(`/inventory?user_id=eq.${userId}`);
    }

    async addToInventory(userId, cardId, quantity = 1) {
        return this.request('/inventory', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                card_id: cardId,
                quantity,
                created_at: new Date().toISOString(),
            }),
        });
    }

    // 게임 매치 관련
    async createMatch(userId, opponentId) {
        return this.request('/matches', {
            method: 'POST',
            body: JSON.stringify({
                player1_id: userId,
                player2_id: opponentId,
                status: 'active',
                created_at: new Date().toISOString(),
            }),
        });
    }

    async getActiveMatches(userId) {
        return this.request(`/matches?or=(player1_id.eq.${userId},player2_id.eq.${userId})&status=eq.active`);
    }

    async updateMatch(matchId, updates) {
        return this.request(`/matches?id=eq.${matchId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
    }

    // 통계 관련
    async getStats(userId) {
        return this.request(`/stats?user_id=eq.${userId}`);
    }

    async updateStats(userId, updates) {
        return this.request(`/stats?user_id=eq.${userId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
    }
}

// 전역 Supabase 클라이언트
const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
