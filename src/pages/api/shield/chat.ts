import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/middleware/withAuth';
import { withRateLimit } from '@/middleware/withRateLimit';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const user = (req as any).user;

  switch (req.method) {
    case 'POST':
      try {
        const { message, conversationId } = req.body;

        // Get user's webhook URL and subscription tier
        const { data: profile } = await supabase
          .from('profiles')
          .select('webhook_url, subscription:subscriptions(tier)')
          .eq('id', user.id)
          .single();

        if (!profile?.webhook_url) {
          return res.status(400).json({ error: 'Webhook not configured' });
        }

        // Create or update conversation
        let conversation;
        if (conversationId) {
          const { data, error } = await supabase
            .from('shield_conversations')
            .select()
            .eq('id', conversationId)
            .single();

          if (error) throw error;
          conversation = data;
        } else {
          const { data, error } = await supabase
            .from('shield_conversations')
            .insert({
              user_id: user.id,
              status: 'active'
            })
            .single();

          if (error) throw error;
          conversation = data;
        }

        // Forward to Make.com webhook
        const response = await fetch(profile.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            conversation_id: conversation.id,
            user_id: user.id,
            subscription_tier: profile.subscription.tier
          })
        });

        const webhookResponse = await response.json();

        // Store message and response
        const { error: messageError } = await supabase
          .from('shield_messages')
          .insert([
            {
              conversation_id: conversation.id,
              content: message,
              role: 'user'
            },
            {
              conversation_id: conversation.id,
              content: webhookResponse.message,
              role: 'assistant'
            }
          ]);

        if (messageError) throw messageError;

        return res.status(200).json({ 
          message: webhookResponse.message,
          conversationId: conversation.id
        });

      } catch (error) {
        console.error('SHIELD chat error:', error);
        return res.status(500).json({ error: 'Failed to process message' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(withRateLimit(handler));
