import { BaseEntity } from './base.types';

export interface Analytics {
  overview: AnalyticsOverview;
  training: TrainingAnalytics;
  documents: DocumentAnalytics;
  shield: ShieldAnalytics;
  compliance: ComplianceAnalytics;
  usage: UsageAnalytics;
}

export interface AnalyticsOverview {
  activeUsers: number;
  totalDocuments: number;
  completedTraining: number;
  complianceRate: number;
  shieldInteractions: number;
  activeIncidents: number;
  trends: {
    period: string;
    metrics: {
      [key: string]: number;
    };
  }[];
}

export interface TrainingAnalytics {
  enrollments: {
    total: number;
    byModule: {
      moduleId: string;
      count: number;
    }[];
    trend: TrendData[];
  };
  completions: {
    total: number;
    rate: number;
    byModule: {
      moduleId: string;
      count: number;
      rate: number;
    }[];
  };
  certifications: {
    active: number;
    expired: number;
    expiringSoon: number;
    byType: {
      type: string;
      count: number;
    }[];
  };
}

export interface DocumentAnalytics {
  totalDocuments: number;
  byCategory: {
    category: string;
    count: number;
  }[];
  byStatus: {
    status: string;
    count: number;
  }[];
  activity: {
    views: number;
    downloads: number;
    shares: number;
    updates: number;
    trend: TrendData[];
  };
  storage: {
    used: number;
    total: number;
    byType: {
      type: string;
      size: number;
    }[];
  };
}

export interface ShieldAnalytics {
  interactions: {
    total: number;
    byCategory: {
      category: string;
      count: number;
    }[];
    trend: TrendData[];
  };
  performance: {
    averageResponseTime: number;
    resolutionRate: number;
    satisfactionScore: number;
    accuracy: number;
  };
  topics: {
    topic: string;
    count: number;
    sentiment: number;
  }[];
}

export interface ComplianceAnalytics {
  overall: {
    score: number;
    trend: TrendData[];
  };
  byDomain: {
    domain: string;
    score: number;
    issues: number;
  }[];
  risks: {
    high: number;
    medium: number;
    low: number;
    trend: TrendData[];
  };
  audits: {
    completed: number;
    pending: number;
    findings: {
      critical: number;
      major: number;
      minor: number;
    };
  };
}

export interface UsageAnalytics {
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
    trend: TrendData[];
  };
  features: {
    feature: string;
    usageCount: number;
    uniqueUsers: number;
  }[];
  storage: {
    used: number;
    total: number;
    trend: TrendData[];
  };
  aiQueries: {
    used: number;
    limit: number;
    trend: TrendData[];
  };
}

export interface TrendData {
  timestamp: string;
  value: number;
}

export interface AnalyticsFilter {
  dateRange: {
    start: string;
    end: string;
  };
  granularity: 'hour' | 'day' | 'week' | 'month';
  categories?: string[];
  departments?: string[];
  users?: string[];
}
