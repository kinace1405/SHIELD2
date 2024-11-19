// src/pages/api/example.ts
import { withAuth } from '@/middleware/withAuth';
import { withRateLimit } from '@/middleware/withRateLimit';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Define response types for better type safety
interface SuccessResponse {
  status: 'success';
  data: any;
  message: string;
}

interface ErrorResponse {
  status: 'error';
  error: string;
  message: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const supabase = createRouteHandlerClient({ cookies });

  // Validate HTTP method
  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(req.method || '')) {
    return res.status(405).json({
      status: 'error',
      error: 'method_not_allowed',
      message: `Method ${req.method} is not allowed`
    });
  }

  try {
    switch (req.method) {
      case 'GET': {
        // Example: Fetch data from Supabase
        const { data, error } = await supabase
          .from('your_table')
          .select('*')
          .limit(10);

        if (error) throw error;

        return res.status(200).json({
          status: 'success',
          data,
          message: 'Data retrieved successfully'
        });
      }

      case 'POST': {
        // Validate request body
        const { title, content } = req.body;

        if (!title || !content) {
          return res.status(400).json({
            status: 'error',
            error: 'validation_error',
            message: 'Title and content are required'
          });
        }

        // Example: Insert data into Supabase
        const { data, error } = await supabase
          .from('your_table')
          .insert([
            {
              title,
              content,
              user_id: req.user.id, // From auth middleware
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (error) throw error;

        return res.status(201).json({
          status: 'success',
          data,
          message: 'Item created successfully'
        });
      }

      case 'PUT': {
        const { id } = req.query;
        const { title, content } = req.body;

        if (!id) {
          return res.status(400).json({
            status: 'error',
            error: 'validation_error',
            message: 'ID is required'
          });
        }

        // Check if user owns the resource
        const { data: existingItem, error: fetchError } = await supabase
          .from('your_table')
          .select('user_id')
          .eq('id', id)
          .single();

        if (fetchError || !existingItem) {
          return res.status(404).json({
            status: 'error',
            error: 'not_found',
            message: 'Item not found'
          });
        }

        if (existingItem.user_id !== req.user.id) {
          return res.status(403).json({
            status: 'error',
            error: 'forbidden',
            message: 'You do not have permission to update this item'
          });
        }

        // Update the item
        const { data, error } = await supabase
          .from('your_table')
          .update({ title, content, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        return res.status(200).json({
          status: 'success',
          data,
          message: 'Item updated successfully'
        });
      }

      case 'DELETE': {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({
            status: 'error',
            error: 'validation_error',
            message: 'ID is required'
          });
        }

        // Check if user owns the resource
        const { data: existingItem, error: fetchError } = await supabase
          .from('your_table')
          .select('user_id')
          .eq('id', id)
          .single();

        if (fetchError || !existingItem) {
          return res.status(404).json({
            status: 'error',
            error: 'not_found',
            message: 'Item not found'
          });
        }

        if (existingItem.user_id !== req.user.id) {
          return res.status(403).json({
            status: 'error',
            error: 'forbidden',
            message: 'You do not have permission to delete this item'
          });
        }

        // Delete the item
        const { error } = await supabase
          .from('your_table')
          .delete()
          .eq('id', id);

        if (error) throw error;

        return res.status(200).json({
          status: 'success',
          data: null,
          message: 'Item deleted successfully'
        });
      }

      default: {
        return res.status(405).json({
          status: 'error',
          error: 'method_not_allowed',
          message: `Method ${req.method} is not allowed`
        });
      }
    }
  } catch (error) {
    console.error('API error:', error);
    
    return res.status(500).json({
      status: 'error',
      error: 'internal_server_error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
}

// Apply multiple middleware (rate limiting and authentication)
export default withRateLimit(withAuth(handler));

// Add TypeScript type for the extended request
declare module 'next' {
  interface NextApiRequest {
    user: {
      id: string;
      email: string;
      role: string;
      // Add other user properties as needed
    };
  }
}
