# 카드 RPG - 온라인 멀티플레이어 게임

토스트 아이콘을 활용한 카드게임과 턴제 RPG가 섞인 온라인 멀티플레이어 게임입니다.

## 기능

- 🎮 **카드 게임**: 30장의 덱으로 구성된 턴제 카드 배틀
- 👥 **멀티플레이어**: 온라인에서 다른 플레이어와 대전
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원
- 🔐 **사용자 인증**: Supabase를 통한 안전한 로그인/회원가입
- 💾 **게임 저장**: 게임 진행 상황 자동 저장
- 📊 **통계**: 플레이어 레벨, 경험치, 승률 추적

## 기술 스택

- **프론트엔드**: HTML5, CSS3, Vanilla JavaScript
- **백엔드**: Supabase (PostgreSQL, Authentication, Real-time)
- **배포**: 정적 호스팅 (Vercel, Netlify, GitHub Pages 등)

## 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd online-card-game
```

### 2. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 URL과 Anon Key 복사
3. `.env` 파일 생성 (`.env.example` 참고):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. 데이터베이스 설정

Supabase SQL Editor에서 다음 쿼리 실행:

```sql
-- 프로필 테이블
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  gold INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 덱 테이블
CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  cards JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 인벤토리 테이블
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  card_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 게임 상태 테이블
CREATE TABLE game_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  state JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 매치 테이블
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id UUID REFERENCES profiles(id),
  player2_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'active',
  winner_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- 통계 테이블
CREATE TABLE stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  total_matches INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 대기 중인 플레이어 테이블
CREATE TABLE players_waiting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'waiting',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. 로컬 서버 실행

간단한 HTTP 서버로 실행:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server 설치 필요)
npx http-server
```

브라우저에서 `http://localhost:8000` 접속

## 게임 플레이

### 기본 규칙
- 각 플레이어는 100 체력으로 시작
- 매 턴마다 마나 1 증가 (최대 5)
- 카드를 배치하거나 스펠을 시전하여 상대방 공격
- 상대방 체력을 0으로 만들면 승리

### 카드 종류
- **유닛**: 필드에 배치하여 공격/방어
- **스펠**: 즉시 효과 발동 (치유, 피해, 방어막 등)

## 프로젝트 구조

```
online-card-game/
├── index.html              # 메인 HTML
├── css/
│   ├── styles.css         # 메인 스타일
│   └── responsive.css     # 반응형 스타일
├── js/
│   ├── main.js            # 메인 로직 및 유틸리티
│   ├── auth.js            # 인증 관리
│   ├── game.js            # 게임 로직
│   ├── cards.js           # 카드 관리
│   ├── multiplayer.js     # 멀티플레이어 관리
│   └── supabase-client.js # Supabase 클라이언트
├── assets/
│   ├── cards/             # 카드 이미지
│   └── icons/             # 게임 아이콘
├── .gitignore             # Git 무시 파일
├── .env.example           # 환경 변수 예제
└── README.md              # 이 파일
```

## 개발 로드맵

- [ ] 카드 이미지 추가
- [ ] 덱 편성 UI 구현
- [ ] 인벤토리 시스템 완성
- [ ] 실시간 멀티플레이어 동기화
- [ ] 랭킹 시스템
- [ ] 게임 내 채팅
- [ ] 모바일 앱 (React Native)
- [ ] 게임 튜토리얼
- [ ] 사운드 효과 및 배경음

## 기여

버그 리포트나 기능 제안은 Issues를 통해 제출해주세요.

## 라이선스

MIT License

## 연락처

문의사항이 있으시면 이메일로 연락주세요.
