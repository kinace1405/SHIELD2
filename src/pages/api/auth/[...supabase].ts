import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiHandler } from 'next';
import { supabase } from '@/lib/supabase';

const handler: NextApiHandler = async (req, res) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  return res.status(200).json({ session });
};

export default handler;
