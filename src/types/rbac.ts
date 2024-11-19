export interface Permission {
  id: string;
  name: string;
  description: string;
  scope: string;
  actions: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isCustom: boolean;
  created_by?: string;
  created_at: string;
}

export interface UserRole {
  user_id: string;
  role_id: string;
  assigned_by: string;
  assigned_at: string;
}

// lib/rbac.ts
import { supabase } from './supabase';
import { Permission, Role } from '@/types/rbac';

export class RBAC {
  private static instance: RBAC;
  private permissionsCache: Map<string, Permission[]> = new Map();
  private rolesCache: Map<string, Role> = new Map();

  private constructor() {}

  static getInstance(): RBAC {
    if (!RBAC.instance) {
      RBAC.instance = new RBAC();
    }
    return RBAC.instance;
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    // Check cache first
    if (this.permissionsCache.has(userId)) {
      return this.permissionsCache.get(userId)!;
    }

    try {
      // Get user's roles
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', userId);

      if (!userRoles?.length) {
        return [];
      }

      // Get permissions for all roles
      const { data: permissions } = await supabase
        .from('role_permissions')
        .select(`
          permissions (
            id,
            name,
            description,
            scope,
            actions
          )
        `)
        .in('role_id', userRoles.map(r => r.role_id));

      const uniquePermissions = this.deduplicatePermissions(
        permissions?.map(p => p.permissions) || []
      );

      // Cache permissions
      this.permissionsCache.set(userId, uniquePermissions);
      
      return uniquePermissions;
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      return [];
    }
  }

  async hasPermission(
    userId: string,
    requiredPermission: string,
    scope?: string,
    action?: string
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    
    return permissions.some(permission => {
      if (permission.name !== requiredPermission) return false;
      if (scope && permission.scope !== scope) return false;
      if (action && !permission.actions.includes(action)) return false;
      return true;
    });
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    try {
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select(`
          roles (
            id,
            name,
            description,
            is_custom,
            created_by,
            created_at,
            permissions:role_permissions (
              permissions (
                id,
                name,
                description,
                scope,
                actions
              )
            )
          )
        `)
        .eq('user_id', userId);

      return userRoles?.map(ur => ({
        ...ur.roles,
        permissions: ur.roles.permissions.map(p => p.permissions)
      })) || [];
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  }

  private deduplicatePermissions(permissions: Permission[]): Permission[] {
    return Array.from(
      new Map(permissions.map(p => [p.id, p])).values()
    );
  }

  clearCache(userId?: string) {
    if (userId) {
      this.permissionsCache.delete(userId);
      this.rolesCache.delete(userId);
    } else {
      this.permissionsCache.clear();
      this.rolesCache.clear();
    }
  }
}

// middleware/withPermission.ts
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { RBAC } from '@/lib/rbac';

interface PermissionOptions {
  permission: string;
  scope?: string;
  action?: string;
}

export function withPermission(
  handler: NextApiHandler,
  options: PermissionOptions
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = (req as any).user;
    const rbac = RBAC.getInstance();

    const hasPermission = await rbac.hasPermission(
      user.id,
      options.permission,
      options.scope,
      options.action
    );

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to perform this action'
      });
    }

    return handler(req, res);
  };
}

// Example permission definitions
const defaultPermissions = {
  // Document permissions
  document_create: {
    name: 'document_create',
    description: 'Create new documents',
    scope: 'documents',
    actions: ['create']
  },
  document_read: {
    name: 'document_read',
    description: 'Read documents',
    scope: 'documents',
    actions: ['read']
  },
  document_update: {
    name: 'document_update',
    description: 'Update documents',
    scope: 'documents',
    actions: ['update']
  },
  document_delete: {
    name: 'document_delete',
    description: 'Delete documents',
    scope: 'documents',
    actions: ['delete']
  },
  document_share: {
    name: 'document_share',
    description: 'Share documents with others',
    scope: 'documents',
    actions: ['share']
  },

  // Team permissions
  team_manage: {
    name: 'team_manage',
    description: 'Manage team members',
    scope: 'team',
    actions: ['invite', 'remove', 'update']
  },
  team_view: {
    name: 'team_view',
    description: 'View team members',
    scope: 'team',
    actions: ['read']
  },

  // Training permissions
  training_assign: {
    name: 'training_assign',
    description: 'Assign training to users',
    scope: 'training',
    actions: ['assign']
  },
  training_view: {
    name: 'training_view',
    description: 'View training modules',
    scope: 'training',
    actions: ['read']
  },
  training_create: {
    name: 'training_create',
    description: 'Create training content',
    scope: 'training',
    actions: ['create', 'update', 'delete']
  },

  // Admin permissions
  admin_access: {
    name: 'admin_access',
    description: 'Full administrative access',
    scope: 'admin',
    actions: ['all']
  }
};

// Default roles
const defaultRoles = {
  owner: {
    name: 'Owner',
    description: 'Full system access',
    permissions: Object.values(defaultPermissions)
  },
  admin: {
    name: 'Administrator',
    description: 'Administrative access without owner capabilities',
    permissions: Object.values(defaultPermissions).filter(
      p => p.name !== 'admin_access'
    )
  },
  manager: {
    name: 'Manager',
    description: 'Team and content management',
    permissions: [
      defaultPermissions.document_create,
      defaultPermissions.document_read,
      defaultPermissions.document_update,
      defaultPermissions.document_share,
      defaultPermissions.team_manage,
      defaultPermissions.team_view,
      defaultPermissions.training_assign,
      defaultPermissions.training_view
    ]
  },
  user: {
    name: 'User',
    description: 'Standard user access',
    permissions: [
      defaultPermissions.document_read,
      defaultPermissions.document_create,
      defaultPermissions.document_update,
      defaultPermissions.team_view,
      defaultPermissions.training_view
    ]
  }
};

// Create database tables:
/*
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  scope TEXT NOT NULL,
  actions TEXT[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);
*/
