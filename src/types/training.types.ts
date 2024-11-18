import { BaseEntity } from './base.types';

export interface TrainingModule extends BaseEntity {
  title: string;
  description: string;
  category: ModuleCategory;
  type: ModuleType;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  prerequisites: string[];
  certification?: CertificationDetails;
  content: ModuleContent[];
  assessment?: Assessment;
  metadata: ModuleMetadata;
}

export type ModuleCategory = 
  | 'health_safety'
  | 'quality'
  | 'environmental'
  | 'compliance'
  | 'leadership'
  | 'technical'
  | 'general';

export type ModuleType = 
  | 'video'
  | 'interactive'
  | 'document'
  | 'webinar'
  | 'workshop'
  | 'assessment';

export interface ModuleContent {
  order: number;
  type: ContentType;
  title: string;
  description?: string;
  duration?: number;
  content: any; // Specific content type data
  required: boolean;
}

export type ContentType = 
  | 'video'
  | 'document'
  | 'quiz'
  | 'interactive'
  | 'assignment';

export interface CertificationDetails {
  name: string;
  validityPeriod: number; // in months
  accreditation?: string;
  requirements: string[];
  recertificationProcess?: string;
}

export interface Assessment {
  passingScore: number;
  maxAttempts: number;
  timeLimit?: number; // in minutes
  questions: Question[];
  randomize: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export type QuestionType = 
  | 'multiple_choice'
  | 'multiple_select'
  | 'true_false'
  | 'short_answer'
  | 'essay';

export interface ModuleMetadata {
  author: string;
  created: string;
  lastUpdated: string;
  version: string;
  tags: string[];
  targetAudience: string[];
  objectives: string[];
  requirements: {
    technical: string[];
    knowledge: string[];
    equipment: string[];
  };
  reviews: ModuleReview[];
  statistics: {
    enrollments: number;
    completions: number;
    averageRating: number;
    averageCompletionTime: number;
  };
}

export interface ModuleReview {
  userId: string;
  rating: number;
  comment?: string;
  timestamp: string;
}

export interface UserProgress extends BaseEntity {
  userId: string;
  moduleId: string;
  status: ProgressStatus;
  progress: number;
  startDate: string;
  lastAccessDate: string;
  completionDate?: string;
  timeSpent: number;
  attempts: AssessmentAttempt[];
  certification?: UserCertification;
}

export type ProgressStatus = 
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'expired';

export interface AssessmentAttempt {
  attemptNumber: number;
  startTime: string;
  endTime: string;
  score: number;
  passed: boolean;
  answers: {
    questionId: string;
    answer: string | string[];
    correct: boolean;
    timeSpent: number;
  }[];
}

export interface UserCertification extends BaseEntity {
  userId: string;
  moduleId: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'revoked';
  verificationUrl: string;
}

export interface TrainingPath extends BaseEntity {
  title: string;
  description: string;
  modules: {
    moduleId: string;
    order: number;
    required: boolean;
  }[];
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  outcomes: string[];
  targetRoles: string[];
}
