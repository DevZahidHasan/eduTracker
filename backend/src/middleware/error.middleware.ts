import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode, message } = err;

  if (!(err instanceof ApiError)) {
    statusCode = err.statusCode || 500;
    message = err.message || 'Internal Server Error';
  }

  // Log the error
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} - ${statusCode} - ${message}`, err);
  } else {
    logger.warn(`[${req.method}] ${req.originalUrl} - ${statusCode} - ${message}`);
  }

  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    errors: err.errors || [],
  };

  res.status(statusCode).json(response);
};
