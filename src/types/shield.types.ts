import { BaseEntity } from './base.types';

export interface ShieldConversation extends BaseEntity {
  userId: string;
  title?: string;
  context?: string;
  messages: ShieldMessage[];
  status: ConversationStatus;
  category: ConversationCategory;
  attachments: ShieldAttachment[];
  metadata: ConversationMetadata;
}

export interface ShieldMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: ShieldAttachment[];
  metadata?: MessageMetadata;
}

export interface ShieldAttachment extends BaseEntity {
  name: string;
  type: AttachmentType;
  size: number;
  url: string;
  metadata: AttachmentMetadata;
}

export type AttachmentType = 
  | 'document'
  | 'image'
  | 'audio'
  | 'video'
  | 'spreadsheet';

export interface AttachmentMetadata {
  mimeType: string;
  extension: string;
  thumbnail?: string;
  processing?: {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;
    error?: string;
  };
}

export type ConversationStatus = 
  | 'active'
  | 'archived'
  | 'pending'
  | 'resolved';

export type ConversationCategory = 
  | 'general'
  | 'health_safety'
  | 'quality'
  | 'environmental'
  | 'compliance'
  | 'training'
  | 'audit'
  | 'incident';

export interface ConversationMetadata {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  relatedDocuments?: string[];
  relatedIncidents?: string[];
  aiConfidence?: number;
}

export interface MessageMetadata {
  intent?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  entities?: Entity[];
  suggestions?: string[];
  sources?: Source[];
}

export interface Entity {
  type: string;
  value: string;
  confidence: number;
}

export interface Source {
  type: 'document' | 'regulation' | 'standard' | 'guideline';
  reference: string;
  url?: string;
}

export interface ShieldAnalysis {
  documentId: string;
  analysisType: 'risk' | 'compliance' | 'quality' | 'environmental';
  results: AnalysisResult[];
  recommendations: Recommendation[];
  timestamp: string;
}

export interface AnalysisResult {
  category: string;
  score: number;
  findings: Finding[];
  status: 'pass' | 'warning' | 'fail';
}

export interface Finding {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  references?: string[];
}

export interface Recommendation {
  category: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  implementation: string;
  expectedBenefits: string[];
}
