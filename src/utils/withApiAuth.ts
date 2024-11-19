// src/utils/withApiAuth.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { cookies } from 'next/headers';

export function withApiAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createRouteHandlerClient({ cookies });
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return res.status(401).json({
        error: 'not_authenticated',
        description: 'The user does not have an active session or is not authenticated',
      });
    }

    // Add user session to request object
    req.session = session;

    return handler(req, res);
  };
}
