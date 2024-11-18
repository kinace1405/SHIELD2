import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { withAuth } from '@/middleware/withAuth';
import { withPermission } from '@/middleware/withPermission';
import { Role } from '@/types/team/role.types';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });

  switch (req.method) {
    case 'GET':
      try {
        const { data: roles, error } = await supabase
          .from('roles')
          .select(`
            *,
            permissions:role_permissions(
              permission_id,
              permission:permissions(*)
            ),
            members:team_members(id)
          `)
          .order('name');

        if (error) throw error;

        // Format the roles data
        const formattedRoles = roles.map((role: any) => ({
          id: role.id,
          name: role.name,
          description: role.description,
          isCustom: role.is_custom,
          permissions: role.permissions.map((p: any) => p.permission),
          members: role.members.length,
          createdAt: role.created_at,
          updatedAt: role.updated_at
        }));

        return res.status(200).json(formattedRoles);
      } catch (error) {
        console.error('Error fetching roles:', error);
        return res.status(500).json({ error: 'Failed to fetch roles' });
      }
      break;

    case 'POST':
      try {
        const roleData: Partial<Role> = req.body;

        // First create the role
        const { data: role, error: roleError } = await supabase
          .from('roles')
          .insert({
            name: roleData.name,
            description: roleData.description,
            is_custom: true
          })
          .single();

        if (roleError) throw roleError;

        // Then create the role permissions
        if (roleData.permissions?.length) {
          const { error: permError } = await supabase
            .from('role_permissions')
            .insert(
              roleData.permissions.map(permission => ({
                role_id: role.id,
                permission_id: permission.id
              }))
            );

          if (permError) throw permError;
        }

        return res.status(201).json(role);
      } catch (error) {
        console.error('Error creating role:', error);
        return res.status(500).json({ error: 'Failed to create role' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(
  withPermission(handler, { permission: 'manage_roles' })
);
