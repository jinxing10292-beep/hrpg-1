// 멀티플레이어 관리
class MultiplayerManager {
    constructor() {
        this.currentMatch = null;
        this.opponentInfo = null;
        this.messageQueue = [];
        this.isConnected = false;
    }

    // 매치 찾기
    async findMatch() {
        try {
            const user = authManager.getCurrentUser();
            if (!user) throw new Error('로그인이 필요합니다');

            showToast('매치를 찾는 중...', 'info');

            // Supabase에서 대기 중인 플레이어 찾기
            const waitingPlayers = await supabase.request('/players_waiting?status=eq.waiting&limit=1');

            if (waitingPlayers.length > 0) {
                // 대기 중인 플레이어와 매치
                const opponent = waitingPlayers[0];
                await this.createMatch(user.id, opponent.user_id);
            } else {
                // 대기 상태로 변경
                await this.setPlayerWaiting(user.id);
                showToast('다른 플레이어를 기다리는 중...', 'info');
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    // 플레이어 대기 상태 설정
    async setPlayerWaiting(userId) {
        try {
            await supabase.request('/players_waiting', {
                method: 'POST',
                body: JSON.stringify({
                    user_id: userId,
                    status: 'waiting',
                    created_at: new Date().toISOString(),
                }),
            });
        } catch (error) {
            console.error('Failed to set player waiting:', error);
        }
    }

    // 매치 생성
    async createMatch(playerId, opponentId) {
        try {
            const match = await supabase.createMatch(playerId, opponentId);
            this.currentMatch = match;
            
            // 상대방 정보 로드
            const opponentProfile = await supabase.getProfile(opponentId);
            this.opponentInfo = opponentProfile;
            
            document.getElementById('opponent-name').textContent = opponentProfile.username;
            
            showToast(`${opponentProfile.username}과(와) 매칭되었습니다!`, 'success');
            
            // 게임 시작
            gameManager.startGame();
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    // 게임 상태 동기화
    async syncGameState(gameState) {
        try {
            if (!this.currentMatch) return;

            await supabase.updateMatch(this.currentMatch.id, {
                state: gameState,
                updated_at: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Failed to sync game state:', error);
        }
    }

    // 상대방 액션 수신
    async receiveOpponentAction(action) {
        this.messageQueue.push(action);
        this.processMessageQueue();
    }

    // 메시지 큐 처리
    processMessageQueue() {
        if (this.messageQueue.length === 0) return;

        const action = this.messageQueue.shift();
        
        switch (action.type) {
            case 'play_card':
                this.handleOpponentPlayCard(action);
                break;
            case 'attack':
                this.handleOpponentAttack(action);
                break;
            case 'end_turn':
                this.handleOpponentEndTurn(action);
                break;
        }
    }

    // 상대방 카드 배치 처리
    handleOpponentPlayCard(action) {
        const card = cardManager.createCard(action.cardId);
        cardManager.addToField(card, false);
        cardManager.render();
    }

    // 상대방 공격 처리
    handleOpponentAttack(action) {
        const attacker = cardManager.opponentField.find(c => c.instanceId === action.attackerId);
        const target = cardManager.playerField.find(c => c.instanceId === action.targetId);
        
        if (attacker && target) {
            gameManager.attackWithCard(attacker, target);
        }
    }

    // 상대방 턴 종료 처리
    handleOpponentEndTurn(action) {
        gameManager.endTurn();
    }

    // 매치 종료
    async endMatch(winner) {
        try {
            if (!this.currentMatch) return;

            await supabase.updateMatch(this.currentMatch.id, {
                status: 'completed',
                winner_id: winner,
                completed_at: new Date().toISOString(),
            });

            this.currentMatch = null;
            this.opponentInfo = null;
        } catch (error) {
            console.error('Failed to end match:', error);
        }
    }

    // 플레이어 정보 조회
    async getPlayerInfo(userId) {
        try {
            return await supabase.getProfile(userId);
        } catch (error) {
            console.error('Failed to get player info:', error);
            return null;
        }
    }

    // 리더보드 조회
    async getLeaderboard(limit = 10) {
        try {
            return await supabase.request(`/profiles?order=level.desc,experience.desc&limit=${limit}`);
        } catch (error) {
            console.error('Failed to get leaderboard:', error);
            return [];
        }
    }
}

const multiplayerManager = new MultiplayerManager();
