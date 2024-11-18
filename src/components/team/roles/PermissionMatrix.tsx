import { Permission } from '@/types/team/permission.types';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PermissionMatrixProps {
  availablePermissions: Permission[];
  selectedPermissions: string[];
  onChange?: (permissions: string[]) => void;
  readonly?: boolean;
}

const PermissionMatrix = ({
  availablePermissions,
  selectedPermissions,
  onChange,
  readonly = false
}: PermissionMatrixProps) => {
  const permissionsByCategory = availablePermissions.reduce((acc, permission) => {
    const category = permission.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleTogglePermission = (permissionId: string) => {
    if (readonly || !onChange) return;

    const newPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter(id => id !== permissionId)
      : [...selectedPermissions, permissionId];
    
    onChange(newPermissions);
  };

  return (
    <div className="space-y-6">
      {Object.entries(permissionsByCategory).map(([category, permissions]) => (
        <div key={category}>
          <h3 className="text-white font-medium mb-4">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className={`
                  p-3 rounded-lg border
                  ${readonly
                    ? 'bg-gray-800/50 border-gray-700'
                    : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'}
                `}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={() => handleTogglePermission(permission.id)}
                    disabled={readonly}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        {permission.name}
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-gray-400 hover:text-white cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm">{permission.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {permission.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {permission.actions.map((action) => (
                        <span
                          key={action}
                          className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-300"
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PermissionMatrix;
