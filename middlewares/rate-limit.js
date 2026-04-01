import { rateLimit } from 'express-rate-limit';

// max 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  message: {
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: 'draft-7', // `RateLimit-*` headers
  legacyHeaders: false, // `X-RateLimit-*` headers disabled
});

// max 10 requests per 15 minutes per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  message: {
    message: 'Too many login attempts. Please try again later.',
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
