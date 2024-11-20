import { NextApiRequest, NextApiResponse } from 'next';
import { z, ZodError, ZodSchema } from 'zod';
import { createError } from './withErrorHandler';

interface ValidationOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function withValidation(schema: ValidationOptions) {
  return function (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
    return async function (req: NextApiRequest, res: NextApiResponse) {
      try {
        // Validate request body if schema provided
        if (schema.body) {
          req.body = schema.body.parse(req.body);
        }

        // Validate query parameters if schema provided
        if (schema.query) {
          req.query = schema.query.parse(req.query);
        }

        // Validate route parameters if schema provided
        if (schema.params) {
          const params = schema.params.parse(req.query);
          req.query = { ...req.query, ...params };
        }

        // Continue to handler
        return handler(req, res);
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            error: 'Validation Error',
            details: error.errors.map(err => ({
              path: err.path.join('.'),
              message: err.message
            }))
          });
        }

        throw error;
      }
    };
  };
}
