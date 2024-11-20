import { NextApiRequest, NextApiResponse } from 'next';
import { PostgrestError } from '@supabase/supabase-js';

interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
  statusCode: number;
}

class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

export function withErrorHandler(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);

      const errorResponse = handleError(error);
      return res.status(errorResponse.statusCode).json(errorResponse);
    }
  };
}

function handleError(error: unknown): ErrorResponse {
  // Handle known error types
  if (error instanceof ApiError) {
    return {
      error: error.name,
      message: error.message,
      details: error.details,
      statusCode: error.statusCode
    };
  }

  // Handle Supabase errors
  if (isSupabaseError(error)) {
    return {
      error: 'Database Error',
      message: error.message,
      details: error.details,
      statusCode: 400
    };
  }

  // Handle validation errors
  if (error instanceof Error && error.name === 'ValidationError') {
    return {
      error: 'Validation Error',
      message: error.message,
      statusCode: 400
    };
  }

  // Handle unknown errors
  return {
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    statusCode: 500
  };
}

function isSupabaseError(error: unknown): error is PostgrestError {
  return (error as PostgrestError)?.code !== undefined && typeof (error as PostgrestError)?.message === 'string';
}

// Error utility functions
export const createError = {
  badRequest: (message: string, details?: any) => 
    new ApiError(message, 400, details),
  
  unauthorized: (message: string = 'Unauthorized') => 
    new ApiError(message, 401),
  
  forbidden: (message: string = 'Forbidden') => 
    new ApiError(message, 403),
  
  notFound: (message: string = 'Resource not found') => 
    new ApiError(message, 404),
  
  conflict: (message: string, details?: any) => 
    new ApiError(message, 409, details),
  
  tooManyRequests: (message: string = 'Too many requests') => 
    new ApiError(message, 429),
  
  internal: (message: string = 'Internal server error') => 
    new ApiError(message, 500)
};
