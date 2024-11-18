import { useState, useEffect } from 'react';
import { useRoles } from '@/hooks/team/useRoles';
import { usePermissions } from '@/hooks/team/usePermissions';
import RoleList from '@/components/team/roles/RoleList';
import RoleEditor from '@/components/team/roles/RoleEditor';
import PermissionMatrix from '@/components/team/roles/PermissionMatrix';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Plus, 
  AlertCircle,
  Copy,
  Trash,
  Save
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Role, Permission } from '@/types/team/role.types';

const RolesPage = () => {
  const { roles, loading, error, createRole, updateRole, deleteRole } = useRoles();
  const { permissions } = usePermissions();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRole, setEditedRole] = useState<Partial<Role> | null>(null);

  const handleCreateRole = () => {
    setSelectedRole(null);
    setEditedRole({
      name: '',
      description: '',
      permissions: [],
      isCustom: true,
    });
    setIsEditing(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setEditedRole({ ...role });
    setIsEditing(true);
  };

  const handleCloneRole = (role: Role) => {
    setSelectedRole(null);
    setEditedRole({
      ...role,
      name: `${role.name} (Copy)`,
      id: undefined,
      isCustom: true,
    });
    setIsEditing(true);
  };

  const handleSaveRole = async () => {
    if (!editedRole) return;

    try {
      if (selectedRole) {
        await updateRole(selectedRole.id, editedRole);
      } else {
        await createRole(editedRole);
      }
      setIsEditing(false);
      setSelectedRole(null);
      setEditedRole(null);
    } catch (err) {
      console.error('Error saving role:', err);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      try {
        await deleteRole(roleId);
        setSelectedRole(null);
        setEditedRole(null);
        setIsEditing(false);
      } catch (err) {
        console.error('Error deleting role:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Role Management</h1>
            <p className="text-gray-400">
              Configure roles and permissions for your team
            </p>
          </div>
          <Button
            onClick={handleCreateRole}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Role
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Role List */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <h2 className="text-lg font-medium text-white">Roles</h2>
              </CardHeader>
              <CardContent>
                <RoleList
                  roles={roles}
                  selectedRole={selectedRole}
                  onSelectRole={setSelectedRole}
                  onEditRole={handleEditRole}
                  onCloneRole={handleCloneRole}
                  onDeleteRole={handleDeleteRole}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>

          {/* Role Editor/Details */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-white">
                    {isEditing 
                      ? (selectedRole ? 'Edit Role' : 'Create New Role')
                      : 'Role Details'
                    }
                  </h2>
                  {selectedRole && !isEditing && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCloneRole(selectedRole)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Clone
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRole(selectedRole)}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      {selectedRole.isCustom && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteRole(selectedRole.id)}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-6">
                    <RoleEditor
                      role={editedRole}
                      onChange={setEditedRole}
                    />
                    <PermissionMatrix
                      availablePermissions={permissions}
                      selectedPermissions={editedRole?.permissions || []}
                      onChange={(permissions) => 
                        setEditedRole(prev => prev ? { ...prev, permissions } : null)
                      }
                    />
                    <div className="flex justify-end gap-4 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedRole(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveRole}
                        className="flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Role
                      </Button>
                    </div>
                  </div>
                ) : selectedRole ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-medium mb-2">
                        {selectedRole.name}
                      </h3>
                      <p className="text-gray-400">
                        {selectedRole.description}
                      </p>
                      {selectedRole.isCustom ? (
                        <span className="badge badge-purple mt-2">
                          Custom Role
                        </span>
                      ) : (
                        <span className="badge badge-gray mt-2">
                          System Role
                        </span>
                      )}
                    </div>
                    <PermissionMatrix
                      availablePermissions={permissions}
                      selectedPermissions={selectedRole.permissions}
                      readonly
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-12">
                    Select a role to view details or create a new role
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesPage;
