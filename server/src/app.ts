import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import formRouter from './routes/formRoutes';
import AppError from './utils/appError';
import { globalErrorHandler } from './controllers/errorController';
import verifyJWT from './middleware/verifyJWT';
import { allowedOrigins } from './utils/constants';
import credentials from './middleware/credentials';
import logger from './middleware/logger';

const app: Application = express();

// Set security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(logger);
app.use(credentials);
app.use(cors({ origin: allowedOrigins }));

// Middleware for sanitization and body parsing
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
app.use(hpp());

// Authentication routes (no JWT required)
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/forms', formRouter);

// Apply JWT verification to the user routes (authentication required)
app.use(verifyJWT);
app.use('/api/v1/user', userRouter);

// Catch-all route for undefined URLs
app.all('*', (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

export default app;
