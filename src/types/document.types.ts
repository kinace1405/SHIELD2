import { BaseEntity } from './base.types';

export interface Document extends BaseEntity {
  userId: string;
  title: string;
  description?: string;
  type: DocumentType;
  category: DocumentCategory;
  status: DocumentStatus;
  version: Version;
  metadata: DocumentMetadata;
  permissions: DocumentPermissions;
  tags: string[];
  file: FileInfo;
}

export type DocumentType = 
  | 'policy'
  | 'procedure'
  | 'form'
  | 'report'
  | 'certificate'
  | 'record'
  | 'template'
  | 'other';

export type DocumentCategory = 
  | 'health_safety'
  | 'quality'
  | 'environmental'
  | 'training'
  | 'compliance'
  | 'incident'
  | 'audit'
  | 'general';

export type DocumentStatus = 
  | 'draft'
  | 'review'
  | 'approved'
  | 'published'
  | 'archived'
  | 'expired';

export interface Version extends BaseEntity {
  number: string;
  changes: string[];
  approvedBy?: string;
  approvedAt?: string;
  previousVersion?: string;
}

export interface DocumentMetadata {
  author: string;
  owner: string;
  department?: string;
  reviewDate?: string;
  expiryDate?: string;
  keywords: string[];
  references: string[];
  approvalWorkflow?: ApprovalWorkflow;
}

export interface ApprovalWorkflow {
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  steps: ApprovalStep[];
  currentStep: number;
}

export interface ApprovalStep {
  order: number;
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  timestamp?: string;
}

export interface DocumentPermissions {
  visibility: 'private' | 'internal' | 'public';
  roles: {
    view: string[];
    edit: string[];
    delete: string[];
    approve: string[];
  };
  sharing: {
    enabled: boolean;
    password?: string;
    expiresAt?: string;
  };
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnail?: string;
  hash: string;
}

export interface DocumentActivity extends BaseEntity {
  documentId: string;
  userId: string;
  action: DocumentAction;
  metadata: ActivityMetadata;
}

export type DocumentAction = 
  | 'created'
  | 'viewed'
  | 'edited'
  | 'deleted'
  | 'archived'
  | 'restored'
  | 'shared'
  | 'downloaded'
  | 'approved'
  | 'rejected';

export interface ActivityMetadata {
  ip?: string;
  userAgent?: string;
  location?: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export interface DocumentShare extends BaseEntity {
  documentId: string;
  sharedBy: string;
  sharedWith: string;
  permission: 'view' | 'edit';
  expiresAt?: string;
  accessCount: number;
  lastAccessed?: string;
}
