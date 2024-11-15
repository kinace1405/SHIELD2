// pages/api/documents/[id].ts
import { withAuth } from '@/middleware/withAuth';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = (req as any).user;
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const { data: document, error } = await supabase
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
            ),
            shares:document_shares(
              user_id,
              permission_level
            )
          `)
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (!document) {
          return res.status(404).json({ error: 'Document not found' });
        }

        // Generate download URL
        const { data: { signedUrl } } = await supabase.storage
          .from('documents')
          .createSignedUrl(
            `${user.id}/${document.id}/${document.name}`,
            60 // URL expires in 60 seconds
          );

        return res.status(200).json({
          ...document,
          downloadUrl: signedUrl
        });
      } catch (error) {
        console.error('Error fetching document:', error);
        return res.status(500).json({ error: 'Failed to fetch document' });
      }
      break;

    case 'PUT':
      try {
        const { name, content, category, tags } = req.body;

        // Check if document exists and belongs to user
        const { data: existingDoc } = await supabase
          .from('documents')
          .select('id')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (!existingDoc) {
          return res.status(404).json({ error: 'Document not found' });
        }

        // Create new version if content changed
        if (content) {
          const { data: latestVersion } = await supabase
            .from('document_versions')
            .select('version_number')
            .eq('document_id', id)
            .order('version_number', { ascending: false })
            .limit(1)
            .single();

          await supabase.from('document_versions').insert({
            document_id: id,
            version_number: latestVersion.version_number + 1,
            file_size: content.size,
            created_by: user.id
          });

// Upload new version
          await supabase.storage
            .from('documents')
            .upload(
              `${user.id}/${id}/${name}`,
              content,
              { upsert: true }
            );
        }

        // Update document metadata
        const { data: updatedDoc, error } = await supabase
          .from('documents')
          .update({
            name: name || undefined,
            category: category || undefined,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .single();

        if (error) throw error;

        // Update tags if provided
        if (tags) {
          // Remove existing tags
          await supabase
            .from('document_tags')
            .delete()
            .eq('document_id', id);

          // Add new tags
          if (tags.length) {
            await supabase
              .from('document_tags')
              .insert(
                tags.map((tag: string) => ({
                  document_id: id,
                  name: tag.toLowerCase()
                }))
              );
          }
        }

        return res.status(200).json(updatedDoc);
      } catch (error) {
        console.error('Error updating document:', error);
        return res.status(500).json({ error: 'Failed to update document' });
      }
      break;

    case 'DELETE':
      try {
        const { data, error } = await supabase
          .from('documents')
          .update({
            deleted_at: new Date().toISOString(),
            status: 'deleted'
          })
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;

        return res.status(200).json({ message: 'Document deleted successfully' });
      } catch (error) {
        console.error('Error deleting document:', error);
        return res.status(500).json({ error: 'Failed to delete document' });
      }
      break;

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withAuth(handler);
