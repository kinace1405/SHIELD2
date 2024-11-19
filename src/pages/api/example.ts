import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { withAuth } from '@/middleware/withAuth';
import { withRateLimit } from '@/middleware/withRateLimit';
import { withLogging } from '@/middleware/withLogging';
import { withErrorHandler } from '@/middleware/withErrorHandler';
import { withValidation } from '@/middleware/withValidation';

// Example validation schema
const requestSchema = {
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    message: z.string().min(10)
  })
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handler implementation
  res.status(200).json({ success: true });
}

// Combine middleware
export default withErrorHandler(
  withAuth(
    withRateLimit(
      withLogging(
        withValidation(requestSchema)(
          handler
        )
      ),
      { maxRequests: 50, interval: 60 * 1000 } // 50 requests per minute
    )
  )
);
