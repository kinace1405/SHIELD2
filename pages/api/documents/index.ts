// pages/api/documents/index.ts
import { withAuth } from '@/middleware/withAuth';
import { withSubscription } from '@/middleware/withSubscription';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = (req as any).user;
  const { search, category, page = 1, limit = 20 } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        let query = supabase
          .from('documents')
          .select(`
            *,
            versions:document_versions(
              id,
              version_number,
              created_at,
              created_by,
              file_size
            ),
            tags:document_tags(
              name
            )
          `)
          .eq('user_id', user.id)
          .eq('deleted_at', null);

        if (search) {
          query = query.or(`name.ilike.%${search}%,content.ilike.%${search}%`);
        }

        if (category) {
          query = query.eq('category', category);
        }

        const { data: documents, error, count } = await query
          .order('created_at', { ascending: false })
          .range((page - 1) * limit, page * limit - 1)
          .throwOnError();

        if (error) throw error;

        return res.status(200).json({
          documents,
          pagination: {
            total: count,
            page: Number(page),
            limit: Number(limit)
          }
        });
      } catch (error) {
        console.error('Error fetching documents:', error);
        return res.status(500).json({ error: 'Failed to fetch documents' });
      }
      break;

    case 'POST':
      try {
        const { name, content, category, tags } = req.body;

        // Check storage limit
        const { data: usageData } = await supabase.rpc('get_storage_usage', {
          user_id: user.id
        });

        const subscription = (req as any).subscription;
        if (usageData.total_size + content.size > subscription.limits.storage) {
          return res.status(400).json({ error: 'Storage limit exceeded' });
        }

        // Create document
        const { data: document, error: docError } = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            name,
            category,
            file_size: content.size,
            mime_type: content.type,
            status: 'active'
          })
          .single();

        if (docError) throw docError;

        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(`${user.id}/${document.id}/${name}`, content);

        if (uploadError) throw uploadError;

        // Create initial version
        await supabase.from('document_versions').insert({
          document_id: document.id,
          version_number: 1,
          file_size: content.size,
          created_by: user.id
        });

        // Add tags
        if (tags?.length) {
          await supabase.from('document_tags').insert(
            tags.map((tag: string) => ({
              document_id: document.id,
              name: tag.toLowerCase()
            }))
          );
        }

        return res.status(201).json(document);
      } catch (error) {
        console.error('Error creating document:', error);
        return res.status(500).json({ error: 'Failed to create document' });
      }
      break;

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default withAuth(
  withSubscription(handler, { requireActive: true })
);
