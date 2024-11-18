export interface Role {
  id: string;
  name: string;
  description: string;
  isCustom: boolean;
  permissions: Permission[];
  members: number;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  actions: PermissionAction[];
  scope?: string;
}

export type PermissionAction = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'manage'
  | 'approve'
  | 'assign'
  | 'share';

export interface RolePermission {
  roleId: string;
  permissionId: string;
  createdAt: string;
}

export interface RoleAssignment {
  userId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: string;
}

// Pre-defined system roles
export const SystemRoles = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
} as const;

// Default permissions by category
export const PermissionCategories = {
  TEAM: 'Team Management',
  DOCUMENTS: 'Document Management',
  TRAINING: 'Training Management',
  SHIELD: 'SHIELD Access',
  ANALYTICS: 'Analytics & Reporting',
  SETTINGS: 'System Settings'
} as const;

export const DefaultPermissions: Record<string, Permission[]> = {
  [SystemRoles.OWNER]: [
    { id: 'all', name: 'Full Access', description: 'Complete system access', category: 'System', actions: ['manage'] }
  ],
  [SystemRoles.ADMIN]: [
    { id: 'team_manage', name: 'Manage Team', description: 'Manage team members', category: 'Team Management', actions: ['create', 'read', 'update', 'delete'] },
    { id: 'roles_manage', name: 'Manage Roles', description: 'Manage roles and permissions', category: 'Team Management', actions: ['create', 'read', 'update', 'delete'] },
    // Add other admin permissions...
  ],
  [SystemRoles.MANAGER]: [
    { id: 'team_view', name: 'View Team', description: 'View team members', category: 'Team Management', actions: ['read'] },
    { id: 'documents_manage', name: 'Manage Documents', description: 'Manage documents', category: 'Document Management', actions: ['create', 'read', 'update', 'delete'] },
    // Add other manager permissions...
  ],
  [SystemRoles.USER]: [
    { id: 'documents_view', name: 'View Documents', description: 'View documents', category: 'Document Management', actions: ['read'] },
    { id: 'shield_access', name: 'Use SHIELD', description: 'Access SHIELD features', category: 'SHIELD Access', actions: ['read'] },
    // Add other user permissions...
  ]
};
