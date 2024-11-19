import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createMiddlewareSupabaseClient({ req, res });
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Add user and supabase client to request object
    (req as any).user = session.user;
    (req as any).supabase = supabase;

    return handler(req, res);
  };
}
