import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/middleware/withAuth';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const user = (req as any).user;

  switch (req.method) {
    case 'GET':
      try {
        const { data: subscription, error } = await supabase
          .from('subscriptions')
          .select(`
            *,
            usage:subscription_usage(*),
            invoices:subscription_invoices(*)
          `)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        return res.status(200).json(subscription);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        return res.status(500).json({ error: 'Failed to fetch subscription' });
      }
      break;

    case 'POST':
      try {
        const { tier, paymentMethodId } = req.body;

        // Get or create customer
        let customerId;
        const { data: customer } = await supabase
          .from('customers')
          .select('stripe_customer_id')
          .eq('user_id', user.id)
          .single();

        if (customer?.stripe_customer_id) {
          customerId = customer.stripe_customer_id;
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', user.id)
            .single();

          const newCustomer = await stripe.customers.create({
            email: profile.email,
            name: profile.full_name,
            payment_method: paymentMethodId,
            invoice_settings: {
              default_payment_method: paymentMethodId
            }
          });

          await supabase
            .from('customers')
            .insert({
              user_id: user.id,
              stripe_customer_id: newCustomer.id
            });

          customerId = newCustomer.id;
        }

        // Create subscription
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: process.env[`STRIPE_PRICE_${tier.toUpperCase()}`] }],
          payment_behavior: 'default_incomplete',
          payment_settings: {
            payment_method_types: ['card'],
            save_default_payment_method: 'on_subscription'
          },
          expand: ['latest_invoice.payment_intent']
        });

        await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            stripe_subscription_id: subscription.id,
            tier,
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000)
          });

        return res.status(200).json({
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret
        });

      } catch (error) {
        console.error('Error creating subscription:', error);
        return res.status(500).json({ error: 'Failed to create subscription' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(handler);
