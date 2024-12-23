// src/middleware/withAuth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiHandler } from 'next';
import { cookies } from 'next/headers';

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();

      if (authError) throw authError;

      if (!session) {
        return res.status(401).json({
          error: 'Not authenticated',
          message: 'Please log in to access this resource'
        });
      }

      // Add user and supabase client to request object
      (req as any).user = session.user;
      (req as any).supabase = supabase;

      // Continue to handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({
        error: 'Authentication error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };
}

// Add type augmentation for the request object
declare module 'next' {
  interface NextApiRequest {
    user?: any;
    supabase?: any;
  }
}
