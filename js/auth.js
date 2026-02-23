// 인증 관리
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 탭 전환
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // 로그인
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));

        // 회원가입
        document.getElementById('signup-form').addEventListener('submit', (e) => this.handleSignup(e));

        // 로그아웃
        document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());
    }

    switchTab(tab) {
        // 탭 버튼 활성화
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // 폼 전환
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', form.id === `${tab}-form`);
        });

        // 에러 메시지 초기화
        document.getElementById(`${tab}-error`).classList.remove('show');
    }

    async handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');

        try {
            errorEl.classList.remove('show');
            
            const data = await supabase.signIn(email, password);
            this.currentUser = data.user;
            
            // 프로필 로드
            const profile = await supabase.getProfile(data.user.id);
            this.currentUser.profile = profile;

            showToast('로그인 성공!', 'success');
            this.switchToGameScreen();
        } catch (error) {
            errorEl.textContent = error.message;
            errorEl.classList.add('show');
            showToast(error.message, 'error');
        }
    }

    async handleSignup(e) {
        e.preventDefault();

        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const passwordConfirm = document.getElementById('signup-password-confirm').value;
        const errorEl = document.getElementById('signup-error');

        try {
            errorEl.classList.remove('show');

            // 비밀번호 확인
            if (password !== passwordConfirm) {
                throw new Error('비밀번호가 일치하지 않습니다');
            }

            // 닉네임 길이 확인
            if (username.length < 2 || username.length > 20) {
                throw new Error('닉네임은 2자 이상 20자 이하여야 합니다');
            }

            const data = await supabase.signUp(email, password, username);
            this.currentUser = data.user;
            this.currentUser.profile = data.user;

            showToast('회원가입 성공! 로그인되었습니다.', 'success');
            this.switchToGameScreen();
        } catch (error) {
            errorEl.textContent = error.message;
            errorEl.classList.add('show');
            showToast(error.message, 'error');
        }
    }

    async handleLogout() {
        if (confirm('정말 로그아웃하시겠습니까?')) {
            await supabase.signOut();
            this.currentUser = null;
            this.switchToAuthScreen();
            showToast('로그아웃되었습니다', 'success');
        }
    }

    switchToGameScreen() {
        document.getElementById('auth-screen').classList.remove('active');
        document.getElementById('main-screen').classList.add('active');
        
        // 플레이어 정보 업데이트
        const profile = this.currentUser.profile;
        document.getElementById('player-name').textContent = profile.username;
        document.getElementById('player-level').textContent = `Lv. ${profile.level}`;
    }

    switchToAuthScreen() {
        document.getElementById('main-screen').classList.remove('active');
        document.getElementById('auth-screen').classList.add('active');
        
        // 폼 초기화
        document.getElementById('login-form').reset();
        document.getElementById('signup-form').reset();
        this.switchTab('login');
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

const authManager = new AuthManager();
