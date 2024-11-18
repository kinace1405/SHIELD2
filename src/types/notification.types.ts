import { BaseEntity } from './base.types';

export interface Notification extends BaseEntity {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'archived';
  action?: NotificationAction;
  metadata: NotificationMetadata;
}

export type NotificationType =
  | 'system'
  | 'document'
  | 'training'
  | 'compliance'
  | 'service'
  | 'security'
  | 'subscription'
  | 'shield';

export interface NotificationAction {
  type: 'link' | 'button' | 'download';
  label: string;
  url: string;
  method?: 'GET' | 'POST';
  data?: Record<string, any>;
}

export interface NotificationMetadata {
  source: string;
  category: string;
  expiresAt?: string;
  thumbnail?: string;
  referenceId?: string;
  additionalInfo?: Record<string, any>;
}

export interface NotificationPreference {
  userId: string;
  channels: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    sms: boolean;
  };
  frequency: {
    type: 'immediate' | 'digest';
    schedule?: 'daily' | 'weekly';
    time?: string;
  };
  categories: {
    [key in NotificationType]: {
      enabled: boolean;
      priority: string[];
    };
  };
}

export interface NotificationDigest {
  userId: string;
  type: 'daily' | 'weekly';
  date: string;
  notifications: Notification[];
  stats: {
    total: number;
    byType: Record<NotificationType, number>;
    byPriority: Record<string, number>;
  };
}
