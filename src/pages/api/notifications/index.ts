import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/middleware/withAuth';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const user = (req as any).user;

  switch (req.method) {
    case 'GET':
      try {
        const { data: notifications, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        return res.status(200).json(notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return res.status(500).json({ error: 'Failed to fetch notifications' });
      }
      break;

    case 'POST':
      try {
        const { title, message, type, metadata } = req.body;

        const { data: notification, error } = await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            title,
            message,
            type,
            metadata,
            read: false
          })
          .single();

        if (error) throw error;

        return res.status(201).json(notification);
      } catch (error) {
        console.error('Error creating notification:', error);
        return res.status(500).json({ error: 'Failed to create notification' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(handler);
