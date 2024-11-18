import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { withAuth } from '@/middleware/withAuth';
import { withPermission } from '@/middleware/withPermission';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const { data: role, error } = await supabase
          .from('roles')
          .select(`
            *,
            permissions:role_permissions(
              permission_id,
              permission:permissions(*)
            ),
            members:team_members(id)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        return res.status(200).json(role);
      } catch (error) {
        console.error('Error fetching role:', error);
        return res.status(500).json({ error: 'Failed to fetch role' });
      }
      break;

    case 'PUT':
      try {
        const updates = req.body;

        // Start a transaction
        const { data: role, error: roleError } = await supabase
          .from('roles')
          .update({
            name: updates.name,
            description: updates.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .single();

        if (roleError) throw roleError;

        // Update permissions
        if (updates.permissions) {
          // First, remove all existing permissions
          await supabase
            .from('role_permissions')
            .delete()
            .eq('role_id', id);

          // Then add new permissions
          if (updates.permissions.length) {
            const { error: permError } = await supabase
              .from('role_permissions')
              .insert(
                updates.permissions.map(permission => ({
                  role_id: id,
                  permission_id: permission.id
                }))
              );

            if (permError) throw permError;
          }
        }

        return res.status(200).json(role);
      } catch (error) {
        console.error('Error updating role:', error);
        return res.status(500).json({ error: 'Failed to update role' });
      }
      break;

    case 'DELETE':
      try {
        // Check if role is custom
        const { data: role, error: roleCheckError } = await supabase
          .from('roles')
          .select('is_custom')
          .eq('id', id)
          .single();

        if (roleCheckError) throw roleCheckError;

        if (!role.is_custom) {
          return res.status(400).json({ 
            error: 'System roles cannot be deleted' 
          });
        }

        // Check if role has members
        const { count, error: countError } = await supabase
          .from('team_members')
          .select('id', { count: 'exact' })
          .eq('role_id', id);

        if (countError) throw countError;

        if (count > 0) {
          return res.status(400).json({ 
            error: 'Cannot delete role with active members' 
          });
        }

        // Delete role and related permissions
        const { error: deleteError } = await supabase
          .from('roles')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;

        return res.status(200).json({ message: 'Role deleted successfully' });
      } catch (error) {
        console.error('Error deleting role:', error);
        return res.status(500).json({ error: 'Failed to delete role' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(
  withPermission(handler, { permission: 'manage_roles' })
);
