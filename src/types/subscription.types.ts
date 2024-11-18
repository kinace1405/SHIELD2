import { BaseEntity } from './base.types';

export type SubscriptionTier = 'miles' | 'centurion' | 'tribune' | 'consul' | 'emperor';

export type SubscriptionStatus = 
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'unpaid';

export interface Subscription extends BaseEntity {
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  canceledAt?: string;
  endedAt?: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  features: SubscriptionFeatures;
  usage: SubscriptionUsage;
}

export interface SubscriptionFeatures {
  userLimit: number;
  storageLimit: number;
  aiQueriesLimit: number;
  customIntegrations: boolean;
  apiAccess: boolean;
  supportLevel: SupportLevel;
  trainingModules: number;
  consultingHours: number;
}

export type SupportLevel = 
  | 'basic'
  | 'priority'
  | 'premium'
  | '24/7'
  | 'dedicated';

export interface SubscriptionUsage {
  activeUsers: number;
  storageUsed: number;
  aiQueriesUsed: number;
  consultingHoursUsed: number;
  lastUpdated: string;
}

export interface SubscriptionInvoice extends BaseEntity {
  subscriptionId: string;
  stripeInvoiceId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  dueDate: string;
  paidAt?: string;
  lineItems: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  description: string;
  amount: number;
  quantity: number;
  period: {
    start: string;
    end: string;
  };
}

export interface SubscriptionChange {
  fromTier: SubscriptionTier;
  toTier: SubscriptionTier;
  effectiveDate: string;
  prorationDate: string;
  amount: number;
  status: 'pending' | 'processed' | 'failed';
}
