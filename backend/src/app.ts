import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { stream } from './utils/logger';
// import { apiLimiter } from './middleware/rateLimit.middleware';

const app = express();
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "*"], // Allow connecting to any API during development/local deploy
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Fixes logo display across ports
  xssFilter: true, // X-XSS-Protection
  frameguard: {
    action: 'deny', // X-Frame-Options: DENY
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true, // X-Content-Type-Options: nosniff
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
}));

// Logging Middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream }));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:6001'
].filter(Boolean) as string[];

// Core Middleware
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use(express.static(path.join(__dirname, '../public')));

// Apply global rate limiter to all API routes
// app.use('/api', apiLimiter);

// Routes
app.use('/api', apiRoutes);

// Health check & Version
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running', version: '1.0.0' });
});

app.get('/api/version', (req, res) => {
  res.status(200).json({ version: '1.0.0', buildDate: new Date().toISOString() });
});

// Error Handling Middleware (must be after routes)
app.use(errorMiddleware);

export default app;
