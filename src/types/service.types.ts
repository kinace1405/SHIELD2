import { BaseEntity } from './base.types';

export interface ServiceRequest extends BaseEntity {
  userId: string;
  type: ServiceType;
  status: RequestStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  details: ServiceDetails;
  scheduling: SchedulingInfo;
  consultant?: ConsultantInfo;
  communications: Communication[];
  documents: ServiceDocument[];
  outcome?: ServiceOutcome;
}

export type ServiceType = 
  | 'audit'
  | 'inspection'
  | 'training'
  | 'consulting'
  | 'certification'
  | 'incident_investigation'
  | 'risk_assessment';

export type RequestStatus = 
  | 'pending'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'canceled'
  | 'on_hold';

export interface ServiceDetails {
  title: string;
  description: string;
  scope: string[];
  requirements: string[];
  deliverables: string[];
  location: {
    type: 'onsite' | 'remote' | 'hybrid';
    address?: string;
  };
  customization?: {
    specific_needs: string[];
    special_requirements: string[];
  };
}

export interface SchedulingInfo {
  preferredDates: {
    start: string;
    end: string;
  }[];
  duration: {
    value: number;
    unit: 'hours' | 'days' | 'weeks';
  };
  confirmed?: {
    startDate: string;
    endDate: string;
  };
  flexibility: boolean;
}

export interface ConsultantInfo {
  id: string;
  name: string;
  specialization: string[];
  qualifications: string[];
  availability: {
    date: string;
    slots: string[];
  }[];
}

export interface Communication {
  id: string;
  type: 'email' | 'call' | 'message' | 'meeting';
  timestamp: string;
  sender: string;
  recipient: string;
  content: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
}

export interface ServiceDocument extends BaseEntity {
  name: string;
  type: 'report' | 'certificate' | 'checklist' | 'evidence' | 'other';
  status: 'draft' | 'final' | 'approved';
  url: string;
  metadata: {
    author: string;
    version: string;
    approver?: string;
  };
}

export interface ServiceOutcome {
  status: 'successful' | 'partially_successful' | 'unsuccessful';
  completionDate: string;
  deliverables: {
    item: string;
    status: 'delivered' | 'pending' | 'not_applicable';
  }[];
  findings: {
    type: 'observation' | 'non_conformity' | 'recommendation';
    description: string;
    priority: 'low' | 'medium' | 'high';
    action_required?: string;
  }[];
  feedback: {
    rating: number;
    comments: string;
    areas_for_improvement?: string[];
  };
}

export interface ServiceQuote extends BaseEntity {
  requestId: string;
  validUntil: string;
  pricing: {
    baseAmount: number;
    additionalCosts: {
      description: string;
      amount: number;
    }[];
    discount?: {
      type: 'percentage' | 'fixed';
      value: number;
    };
    total: number;
  };
  terms: {
    paymentTerms: string;
    cancellationPolicy: string;
    additionalTerms?: string[];
  };
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
}
