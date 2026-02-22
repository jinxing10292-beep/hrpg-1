# Sword Enhancement Game (검 강화하기) - PRD

## Overview
A web-based sword enhancement game where players can enhance their swords, battle others, and climb the rankings.

## Game Economy
- **Currencies**:
  - Gold (G): Basic in-game currency
  - Money (M): Premium currency
- **Exchange Rate**: 120M = 1C = 120,000G (1M = 1,000G)
- **No exchange fees**

## Core Gameplay

### Enhancement System
- Enhancement levels: 0 to 20
- Each enhancement attempt can result in:
  - Success: Level increases by 1
  - Maintain: Level stays the same
  - Destroy: Weapon resets to +0, player receives 30% of sell value
- Hidden weapons have 4x sell value
- Global notifications for enhancements level 10 and above

### User Profiles
- Display:
  - Current gold and money
  - Current sword (name, level, description)
  - Battle record (wins/losses)
  - Best sword achieved

### Battle System
- Random battles against other players
- Direct challenges via @mention
- Battle results affect rankings

### Daily Rewards
- Daily login bonus in gold
- Streak bonuses for consecutive logins

## Technical Stack

### Frontend
- React + Vite
- Zustand for state management
- TailwindCSS for styling
- Mobile-first responsive design

### Backend
- Node.js + Express
- PostgreSQL for data persistence
- Server-Sent Events (SSE) for real-time notifications

### Authentication
- 8-character alphanumeric personal key for each user
- No traditional login required

## User Accounts

| Name (Korean) | Name (English) | Personal Key |
|---------------|----------------|--------------|
| 조예준       | Ye-jun Cho     | yj7f9k2m     |
| 박은찬       | Eun-chan Park  | ec5h8j3n     |
| 김동혁       | Dong-hyuk Kim  | dh4k9l7p     |
| 정결         | Gyeol Jeong    | gj2m6n9p     |
| 이승준       | Seung-jun Lee  | sj8p4m2k     |
| 이정태       | Jung-tae Lee   | jt5n8k3m     |
| 김산         | San Kim        | sk9m2n6p     |

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register with personal key
- `GET /api/auth/me`: Get current user profile

### Game
- `POST /api/game/enhance`: Attempt to enhance current sword
- `GET /api/game/battle/random`: Start random battle
- `POST /api/game/battle/:opponentId`: Challenge specific opponent
- `GET /api/game/leaderboard`: Get current rankings
- `POST /api/game/daily-reward`: Claim daily reward

### Inventory
- `GET /api/inventory`: Get user's current sword and items
- `POST /api/inventory/sell`: Sell current sword

## Database Schema

### users
- id: UUID (PK)
- name: String
- personal_key: String (8 chars, unique)
- gold: BigInt (default: 1000)
- money: Integer (default: 0)
- created_at: Timestamp
- last_login: Timestamp
- login_streak: Integer

### swords
- id: UUID (PK)
- user_id: UUID (FK to users)
- name: String
- level: Integer (0-20)
- base_power: Integer
- current_power: Integer
- is_hidden: Boolean (default: false)
- created_at: Timestamp
- enhanced_at: Timestamp

### battles
- id: UUID (PK)
- player1_id: UUID (FK to users)
- player2_id: UUID (FK to users)
- winner_id: UUID (FK to users, nullable for draws)
- player1_sword_id: UUID (FK to swords)
- player2_sword_id: UUID (FK to swords)
- created_at: Timestamp

## Deployment
- **Platform**: Render
- **Database**: PostgreSQL
- **Environment Variables**:
  - `DATABASE_URL`: PostgreSQL connection string
  - `JWT_SECRET`: For authentication tokens
  - `NODE_ENV`: 'production' or 'development'
