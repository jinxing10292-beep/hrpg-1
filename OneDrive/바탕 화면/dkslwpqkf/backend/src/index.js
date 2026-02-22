import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import gameRoutes from './routes/game.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import rewardRoutes from './routes/reward.routes.js';
import { authenticateToken } from './middleware/auth.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', authenticateToken, gameRoutes);
app.use('/api/inventory', authenticateToken, inventoryRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/rewards', authenticateToken, rewardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
