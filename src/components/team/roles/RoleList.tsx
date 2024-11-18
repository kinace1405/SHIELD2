import { Role } from '@/types/team/role.types';
import { Badge } from '@/components/ui/badge';
import { Shield, Copy, Trash, ChevronRight } from 'lucide-react';

interface RoleListProps {
  roles: Role[];
  selectedRole: Role | null;
  onSelectRole: (role: Role) => void;
  onEditRole: (role: Role) => void;
  onCloneRole: (role: Role) => void;
  onDeleteRole: (roleId: string) => void;
  loading?: boolean;
}

const RoleList = ({
  roles,
  selectedRole,
  onSelectRole,
  onEditRole,
  onCloneRole,
  onDeleteRole,
  loading
}: RoleListProps) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 bg-gray-700/50 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {roles.map((role) => (
        <div
          key={role.id}
          className={`
            p-3 rounded-lg cursor-pointer
            ${selectedRole?.id === role.id
              ? 'bg-custom-purple/20 border border-custom-purple'
              : 'bg-gray-700/50 border border-transparent hover:border-gray-600'
            }
          `}
          onClick={() => onSelectRole(role)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className={`w-5 h-5 ${
                selectedRole?.id === role.id 
                  ? 'text-custom-purple' 
                  : 'text-gray-400'
              }`} />
              <div>
                <h3 className="text-white font-medium">
                  {role.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {role.members} members
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {role.isCustom ? (
                <Badge variant="purple">Custom</Badge>
              ) : (
                <Badge variant="secondary">System</Badge>
              )}
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoleList;
