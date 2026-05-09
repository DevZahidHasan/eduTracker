import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// Security Middleware
app.use(helmet());

// Logging Middleware
app.use(morgan('dev'));

// Core Middleware
app.use(cors());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

// Error Handling Middleware (must be after routes)
app.use(errorMiddleware);

export default app;
