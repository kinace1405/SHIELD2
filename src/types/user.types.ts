import { BaseEntity } from './base.types';

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  role: UserRole;
  status: UserStatus;
  phoneNumber?: string;
  avatar?: string;
  lastLogin?: string;
  emailVerified: boolean;
  preferences: UserPreferences;
}

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export type UserRole = 'owner' | 'admin' | 'manager' | 'user';

export interface UserPreferences {
  notifications: NotificationPreferences;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  emailDigest: 'never' | 'daily' | 'weekly';
  categories: {
    security: boolean;
    updates: boolean;
    marketing: boolean;
    system: boolean;
  };
}

export interface UserProfile extends BaseEntity {
  userId: string;
  company: CompanyProfile;
  department?: string;
  jobTitle?: string;
  location?: string;
  skills: string[];
  certifications: Certification[];
  trainingProgress: TrainingProgress[];
}

export interface CompanyProfile extends BaseEntity {
  name: string;
  size: string;
  industry: string;
  address: Address;
  website?: string;
  registrationNumber?: string;
  vatNumber?: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  certificateNumber: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface TrainingProgress {
  moduleId: string;
  progress: number;
  startDate: string;
  completionDate?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'expired';
}
