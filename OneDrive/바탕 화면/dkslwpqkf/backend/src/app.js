import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { testConnection, runMigrations } from './config/db.config.js';
import authRoutes from './routes/auth.routes.js';
import gameRoutes from './routes/game.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

export const createApp = async () => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }

  // Test database connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('Failed to connect to the database. Exiting...');
    process.exit(1);
  }

  // Run migrations
  const migrationsSucceeded = await runMigrations();
  if (!migrationsSucceeded) {
    console.error('Database migrations failed. Exiting...');
    process.exit(1);
  }

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/game', gameRoutes);
  app.use('/api/inventory', inventoryRoutes);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 404 handler
  app.use(notFound);
  
  // Error handler
  app.use(errorHandler);

  return app;
};

export default createApp;
