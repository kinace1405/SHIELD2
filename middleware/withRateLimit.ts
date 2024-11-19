import rateLimit from 'express-rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

export function withRateLimit(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    await new Promise((resolve) => limiter(req, res, resolve));
    return handler(req, res);
  };
}
