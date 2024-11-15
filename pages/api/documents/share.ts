import { withAuth } from '@/middleware/withAuth';
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = (req as any).user;
  const { documentId, shareWith, permissionLevel } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify document ownership
    const { data: document } = await supabase
      .from('documents')
      .select('id')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Create share record
    const { data: share, error } = await supabase
      .from('document_shares')
      .insert({
        document_id: documentId,
        user_id: shareWith,
        permission_level: permissionLevel,
        created_by: user.id
      })
      .single();

    if (error) throw error;

    // Send notification to shared user
    await supabase
      .from('notifications')
      .insert({
        user_id: shareWith,
        type: 'document_shared',
        content: `${user.email} has shared a document with you`,
        reference_id: documentId
      });

    return res.status(200).json(share);
  } catch (error) {
    console.error('Error sharing document:', error);
    return res.status(500).json({ error: 'Failed to share document' });
  }
}

export default withAuth(handler);
