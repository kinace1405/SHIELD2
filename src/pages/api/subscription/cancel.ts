import { withAuth } from '@/middleware/withAuth';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = (req as any).user;

  try {
    // Get subscription details
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .single();

    if (!subscription?.stripe_subscription_id) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Cancel subscription in Stripe
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Update subscription status in database
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceling',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    return res.status(200).json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return res.status(500).json({ error: 'Failed to cancel subscription' });
  }
}

export default withAuth(handler);
