import rateLimit from 'express-rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

interface RateLimitOptions {
  interval?: number; // in milliseconds
  maxRequests?: number;
  identifier?: (req: NextApiRequest) => string;
}

export function withRateLimit(handler: any, options: RateLimitOptions = {}) {
  const {
    interval = 60 * 1000, // 1 minute default
    maxRequests = 100,    // 100 requests per interval default
    identifier = (req) => {
      return req.headers['x-forwarded-for'] as string || 
             req.socket.remoteAddress || 
             'unknown';
    }
  } = options;

  return async (req: NextApiRequest, res: NextApiResponse) => {
    const ip = identifier(req);
    const key = `rate-limit:${ip}:${req.url}`;

    try {
      // Get the current request count
      const current = await redis.get(key) as number || 0;

      // Check if limit is exceeded
      if (current >= maxRequests) {
        return res.status(429).json({
          error: 'Too Many Requests',
          message: 'Please try again later',
          retryAfter: interval / 1000 // seconds
        });
      }

      // Increment request count
      await redis.incr(key);

      // Set expiry if this is the first request
      if (current === 0) {
        await redis.expire(key, interval / 1000);
      }

      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - current - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil(Date.now() / interval) * interval);

      // Continue to handler
      return handler(req, res);
    } catch (error) {
      console.error('Rate limit error:', error);
      // Continue to handler even if rate limiting fails
      return handler(req, res);
    }
  };
}
