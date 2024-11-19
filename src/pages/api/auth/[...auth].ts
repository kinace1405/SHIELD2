import { NextApiRequest, NextApiResponse } from 'next';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { withRateLimit } from '@/middleware/withRateLimit';
import { cookies } from 'next/headers';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createRouteHandlerClient({ cookies });

  switch (req.method) {
    case 'POST': {
      try {
        const { action } = req.query;
        const { email, password, userData } = req.body;

        switch (action) {
          case 'login': {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (signInError) throw signInError;
            return res.status(200).json(signInData);
          }

          case 'register': {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: userData,
              },
            });
            if (signUpError) throw signUpError;
            return res.status(201).json(signUpData);
          }

          case 'logout': {
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) throw signOutError;
            return res.status(200).json({ message: 'Signed out successfully' });
          }

          default: {
            return res.status(400).json({ error: 'Invalid action' });
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ error: error.message });
      }
    }

    default: {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}

export default withRateLimit(handler);
