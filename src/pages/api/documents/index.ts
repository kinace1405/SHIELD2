import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/middleware/withAuth';
import { withRateLimit } from '@/middleware/withRateLimit';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const user = (req as any).user;

  switch (req.method) {
    case 'GET':
      try {
        const { category, search, page = 1, limit = 20 } = req.query;

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

        if (category) {
          query = query.eq('category', category);
        }

        if (search) {
          query = query.or(`name.ilike.%${search}%,content.ilike.%${search}%`);
        }

        const { data, error, count } = await query
          .order('created_at', { ascending: false })
          .range((page - 1) * limit, page * limit - 1);

        if (error) throw error;

        return res.status(200).json({
          documents: data,
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
        const { name, category, content } = req.body;

        // Check storage limit
        const { data: usage } = await supabase.rpc('calculate_storage_usage', {
          user_id: user.id
        });

        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('tier')
          .eq('user_id', user.id)
          .single();

        // Get storage limit based on subscription tier
        const limits = {
          miles: 5 * 1024 * 1024 * 1024, // 5GB
          centurion: 20 * 1024 * 1024 * 1024, // 20GB
          tribune: 30 * 1024 * 1024 * 1024, // 30GB
          consul: 100 * 1024 * 1024 * 1024, // 100GB
          emperor: -1 // Unlimited
        };

        const storageLimit = limits[subscription.tier];
        if (storageLimit !== -1 && usage + content.size > storageLimit) {
          return res.status(400).json({ error: 'Storage limit exceeded' });
        }

        // Create document record
        const { data: document, error: docError } = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            name,
            category,
            file_size: content.size,
            mime_type: content.type
          })
          .single();

        if (docError) throw docError;

        // Upload file
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(`${user.id}/${document.id}/${name}`, content);

        if (uploadError) throw uploadError;

        return res.status(201).json(document);

      } catch (error) {
        console.error('Error creating document:', error);
        return res.status(500).json({ error: 'Failed to create document' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(withRateLimit(handler));
