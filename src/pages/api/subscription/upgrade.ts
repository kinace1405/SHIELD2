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
    // Get current subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, tier')
      .eq('user_id', user.id)
      .single();

    // Create Stripe checkout session for upgrade
    const session = await stripe.checkout.sessions.create({
      customer: subscription.stripe_customer_id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env[`STRIPE_PRICE_${subscription.tier.toUpperCase()}`],
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/subscription?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/subscription`,
      subscription_data: {
        metadata: {
          user_id: user.id,
        },
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating upgrade session:', error);
    return res.status(500).json({ error: 'Failed to create upgrade session' });
  }
}

export default withAuth(handler);
