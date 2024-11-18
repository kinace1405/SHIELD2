import { withAuth } from '@/middleware/withAuth';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = (req as any).user;

  try {
    // Get customer ID from Supabase
    const { data: customer } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!customer?.stripe_customer_id) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: customer.stripe_customer_id,
      limit: 12,
    });

    const billingHistory = invoices.data.map(invoice => ({
      id: invoice.id,
      date: invoice.created * 1000, // Convert to milliseconds
      description: invoice.lines.data[0]?.description || 'Subscription payment',
      amount: invoice.amount_paid / 100, // Convert from cents
      status: invoice.status,
      invoice_url: invoice.hosted_invoice_url
    }));

    return res.status(200).json(billingHistory);
  } catch (error) {
    console.error('Error fetching billing history:', error);
    return res.status(500).json({ error: 'Failed to fetch billing history' });
  }
}

export default withAuth(handler);
