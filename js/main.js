// 유틸리티 함수들

// 토스트 알림 표시
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // 3초 후 제거
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 모달 표시
function showModal(title, content) {
    const overlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <span class="modal-close" onclick="closeModal()">&times;</span>
        <h2>${title}</h2>
        <p>${content}</p>
    `;
    
    overlay.classList.add('active');
}

// 모달 닫기
function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// 모달 외부 클릭 시 닫기
document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
        closeModal();
    }
});

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('게임 초기화 완료');
    
    // Supabase 설정 확인
    if (supabase.url === 'https://your-project.supabase.co') {
        showToast('⚠️ Supabase 설정이 필요합니다', 'warning');
    }
});

// 반응형 디자인 테스트
window.addEventListener('resize', () => {
    console.log(`Window size: ${window.innerWidth}x${window.innerHeight}`);
});

// 키보드 단축키
document.addEventListener('keydown', (e) => {
    // ESC: 모달 닫기
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Enter: 로그인/회원가입
    if (e.key === 'Enter') {
        const activeForm = document.querySelector('.auth-form.active');
        if (activeForm) {
            activeForm.dispatchEvent(new Event('submit'));
        }
    }
});

// 슬라이드 아웃 애니메이션
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 게임 상태 저장 (주기적)
setInterval(() => {
    if (gameManager.gameActive && authManager.currentUser) {
        const gameState = {
            playerHealth: gameManager.playerHealth,
            opponentHealth: gameManager.opponentHealth,
            playerMana: gameManager.playerMana,
            opponentMana: gameManager.opponentMana,
            currentTurn: gameManager.currentTurn,
            playerField: cardManager.playerField,
            opponentField: cardManager.opponentField,
            playerHand: cardManager.playerHand,
            opponentHand: cardManager.opponentHand,
        };
        
        // 로컬 스토리지에 저장
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }
}, 5000);

// 페이지 언로드 시 게임 상태 저장
window.addEventListener('beforeunload', () => {
    if (gameManager.gameActive && authManager.currentUser) {
        const gameState = {
            playerHealth: gameManager.playerHealth,
            opponentHealth: gameManager.opponentHealth,
            playerMana: gameManager.playerMana,
            opponentMana: gameManager.opponentMana,
            currentTurn: gameManager.currentTurn,
            playerField: cardManager.playerField,
            opponentField: cardManager.opponentField,
            playerHand: cardManager.playerHand,
            opponentHand: cardManager.opponentHand,
        };
        
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }
});

console.log('메인 스크립트 로드 완료');
