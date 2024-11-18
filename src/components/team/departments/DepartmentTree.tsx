import { Department } from '@/types/team/department.types';
import { 
  Building2,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Edit,
  Trash,
  Users,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

interface DepartmentTreeProps {
  departments: Department[];
  selectedDepartment: Department | null;
  onSelect: (department: Department) => void;
  onEdit: (department: Department) => void;
  onDelete: (departmentId: string) => void;
  onAddSubDepartment?: (parentId: string) => void;
  loading?: boolean;
}

const DepartmentTree = ({
  departments,
  selectedDepartment,
  onSelect,
  onEdit,
  onDelete,
  onAddSubDepartment,
  loading
}: DepartmentTreeProps) => {
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());

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

  const toggleExpand = (deptId: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepts(newExpanded);
  };

  const renderDepartment = (dept: Department, level: number = 0) => {
    const children = departments.filter(d => d.parentId === dept.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedDepts.has(dept.id);

    return (
      <div key={dept.id} className="space-y-2">
        <div
          className={`
            flex items-center justify-between p-3 rounded-lg cursor-pointer
            ${selectedDepartment?.id === dept.id
              ? 'bg-custom-purple/20 border border-custom-purple'
              : 'bg-gray-700/50 border border-transparent hover:border-gray-600'
            }
          `}
          style={{ marginLeft: `${level * 1.5}rem` }}
        >
          <div className="flex items-center gap-3 flex-1">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(dept.id);
                }}
                className="text-gray-400 hover:text-white"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            <Building2 className={`w-5 h-5 ${
              selectedDepartment?.id === dept.id 
                ? 'text-custom-purple' 
                : 'text-gray-400'
            }`} />
            <div className="flex-1" onClick={() => onSelect(dept)}>
              <h3 className="text-white font-medium">{dept.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>{dept.memberCount} members</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-gray-600 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(dept)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Department
                </DropdownMenuItem>
                {onAddSubDepartment && (
                  <DropdownMenuItem onClick={() => onAddSubDepartment(dept.id)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Sub-department
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => onDelete(dept.id)}
                  className="text-red-500 focus:text-red-500"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete Department
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="space-y-2">
            {children.map(child => renderDepartment(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Get root level departments
  const rootDepartments = departments.filter(d => !d.parentId);

  return (
    <div className="space-y-2">
      {rootDepartments.map(dept => renderDepartment(dept))}
    </div>
  );
};

export default DepartmentTree;
