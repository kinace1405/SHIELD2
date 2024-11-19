import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

interface LogEntry {
  method: string;
  url: string;
  status: number;
  duration: number;
  userId?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export function withLogging(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const startTime = Date.now();
    const originalJson = res.json;
    let statusCode = 200;
    let error: Error | null = null;

    // Override res.json to capture response status
    res.json = function (data) {
      statusCode = res.statusCode;
      return originalJson.call(this, data);
    };

    try {
      // Execute handler
      const result = await handler(req, res);

      // Log successful request
      await logRequest({
        method: req.method || 'UNKNOWN',
        url: req.url || 'UNKNOWN',
        status: statusCode,
        duration: Date.now() - startTime,
        userId: (req as any).user?.id,
        metadata: {
          query: req.query,
          headers: sanitizeHeaders(req.headers),
          userAgent: req.headers['user-agent']
        }
      });

      return result;
    } catch (err) {
      error = err as Error;
      
      // Log failed request
      await logRequest({
        method: req.method || 'UNKNOWN',
        url: req.url || 'UNKNOWN',
        status: statusCode,
        duration: Date.now() - startTime,
        userId: (req as any).user?.id,
        error: error.message,
        metadata: {
          query: req.query,
          headers: sanitizeHeaders(req.headers),
          userAgent: req.headers['user-agent'],
          errorStack: error.stack
        }
      });

      throw error;
    }
  };
}

async function logRequest(entry: LogEntry) {
  try {
    await supabase
      .from('api_logs')
      .insert([{
        method: entry.method,
        url: entry.url,
        status: entry.status,
        duration_ms: entry.duration,
        user_id: entry.userId,
        error: entry.error,
        metadata: entry.metadata
      }]);
  } catch (error) {
    console.error('Failed to log request:', error);
  }
}

function sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
  const sanitized = { ...headers };
  // Remove sensitive headers
  const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
  sensitiveHeaders.forEach(header => {
    if (sanitized[header]) {
      sanitized[header] = '[REDACTED]';
    }
  });
  return sanitized;
}
