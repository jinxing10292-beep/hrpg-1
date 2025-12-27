# 검 강화하기 (Sword Enhancement Game)

A full-stack web application for a sword enhancement game built with React, Node.js, and PostgreSQL.

## 🚀 Features

- **Sword Enhancement System**: Enhance your sword from +0 to +20 with risks and rewards
- **Economy**: In-game currency system with Gold (G), Choco (C), and Money (M)
- **Real-time Updates**: Server-Sent Events (SSE) for live game updates
- **Responsive Design**: Mobile-first approach for all devices
- **User Authentication**: Secure login with personal keys

## 🛠 Tech Stack

- **Frontend**: React + Vite, Zustand, TailwindCSS
- **Backend**: Node.js, Express, PostgreSQL
- **Deployment**: Docker, Docker Compose, Nginx
- **Real-time**: Server-Sent Events (SSE)
- **State Management**: Zustand
- **Styling**: TailwindCSS with Headless UI

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   cd YOUR_REPOSITORY
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the development environment**
   ```bash
   # Using Docker (recommended)
   docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
   
   # Or run services manually
   # Start backend
   cd backend
   npm install
   npm run dev
   
   # In a new terminal, start frontend
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Database Admin: http://localhost:8080

## 🏗 Project Structure

```
.
├── backend/              # Backend server
│   ├── src/             # Source code
│   ├── migrations/      # Database migrations
│   └── package.json
├── frontend/            # Frontend application
│   ├── src/             # Source code
│   └── package.json
├── nginx/               # Nginx configuration
├── docker-compose.yml   # Production setup
└── docker-compose.override.yml  # Development overrides
```

## 🚀 Deployment

### Production Deployment

1. **Build and run**
   ```bash
   docker-compose up -d --build
   ```

2. **Run database migrations**
   ```bash
   docker-compose exec backend npm run migrate:prod
   ```

3. **Access the application**
   - Frontend: http://your-domain.com
   - Backend API: http://your-domain.com/api

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by Your Name
- Inspired by classic RPG enhancement systems
- Special thanks to all contributors

---

<div align="center">
  Made with :heart: and JavaScript
</div>
