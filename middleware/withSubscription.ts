// middleware/withSubscription.ts
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

interface SubscriptionOptions {
  requiredTier?: string;
  requireActive?: boolean;
  allowTrial?: boolean;
}

const tierLevels = {
  'miles': 1,
  'centurion': 2,
  'tribune': 3,
  'consul': 4,
  'emperor': 5
};

export function withSubscription(handler: NextApiHandler, options: SubscriptionOptions = {}) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createMiddlewareSupabaseClient({ req, res });
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Get user's subscription
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select(`
          tier,
          status,
          trial_ends_at,
          current_period_end
        `)
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        throw error;
      }

      // Check if subscription is required to be active
      if (options.requireActive && subscription.status !== 'active') {
        // Allow trial access if specified
        if (options.allowTrial && 
            subscription.trial_ends_at && 
            new Date(subscription.trial_ends_at) > new Date()) {
          // Continue with handler if in trial period
        } else {
          return res.status(403).json({
            error: 'Inactive subscription',
            code: 'SUBSCRIPTION_INACTIVE'
          });
        }
      }

      // Check required tier
      if (options.requiredTier) {
        const userTierLevel = tierLevels[subscription.tier.toLowerCase()];
        const requiredTierLevel = tierLevels[options.requiredTier.toLowerCase()];

        if (!userTierLevel || userTierLevel < requiredTierLevel) {
          return res.status(403).json({
            error: 'Subscription tier not sufficient',
            code: 'INSUFFICIENT_TIER',
            requiredTier: options.requiredTier
          });
        }
      }

      // Check usage limits
      const { data: usage } = await supabase
        .rpc('get_current_usage', { user_id: session.user.id });

      const tierLimits = {
        miles: { storage: 5, queries: 100, users: 1 },
        centurion: { storage: 20, queries: 250, users: 3 },
        tribune: { storage: 30, queries: 500, users: 5 },
        consul: { storage: 100, queries: -1, users: -1 },
        emperor: { storage: -1, queries: -1, users: -1 }
      };

      const limits = tierLimits[subscription.tier.toLowerCase()];

      // Check specific limits based on the request type
      if (req.url?.includes('/api/documents') && limits.storage !== -1) {
        const storageUsed = usage.storage_used || 0;
        if (storageUsed >= limits.storage * 1024 * 1024 * 1024) {
          return res.status(403).json({
            error: 'Storage limit exceeded',
            code: 'STORAGE_LIMIT_EXCEEDED'
          });
        }
      }

      if (req.url?.includes('/api/shield') && limits.queries !== -1) {
        const queriesUsed = usage.queries_used || 0;
        if (queriesUsed >= limits.queries) {
          return res.status(403).json({
            error: 'Monthly AI query limit exceeded',
            code: 'QUERY_LIMIT_EXCEEDED'
          });
        }
      }

      // Add subscription info to request object
      (req as any).subscription = {
        tier: subscription.tier,
        status: subscription.status,
        limits,
        usage
      };

      // Continue with the handler
      return handler(req, res);

    } catch (error) {
      console.error('Subscription validation error:', error);
      return res.status(500).json({ error: 'Error validating subscription' });
    }
  };
}
