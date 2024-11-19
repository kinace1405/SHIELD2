```typescript
import { Department } from '@/types/team/department.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users,
  Building2,
  Calendar,
  Edit,
  Trash,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

interface DepartmentDetailsProps {
  department: Department;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

const DepartmentDetails = ({ 
  department,
  onEdit,
  onDelete
}: DepartmentDetailsProps) => {
  const handleDelete = () => {
    if (department.memberCount > 0) {
      alert('Cannot delete department with active members. Please reassign members first.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      onDelete(department.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <Building2 className="w-6 h-6 text-custom-purple" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-white">
                {department.name}
              </h3>
              <p className="text-sm text-gray-400">
                Created {new Date(department.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={department.memberCount > 0}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <p className="text-gray-300">
          {department.description || 'No description provided.'}
        </p>
      </div>

      {/* Department Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Members</p>
                <p className="text-2xl font-bold text-white">
                  {department.memberCount}
                </p>
              </div>
              <Users className="w-8 h-8 text-custom-purple" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Sub-departments</p>
                <p className="text-2xl font-bold text-white">
                  {department.subDepartments?.length || 0}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-custom-purple" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Last Updated</p>
                <p className="text-sm font-medium text-white">
                  {new Date(department.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-custom-purple" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Members */}
      {department.memberCount > 0 && (
        <div>
          <h4 className="text-lg font-medium text-white mb-4">Department Members</h4>
          <div className="space-y-2">
            {department.members?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                    {member.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{member.name}</p>
                    <p className="text-sm text-gray-400">{member.role}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning for Department with Members */}
      {department.memberCount > 0 && (
        <div className="p-4 bg-yellow-500/10 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-500">
            <AlertTriangle className="w-5 h-5" />
            <p>
              This department has active members. Members must be reassigned before the department can be deleted.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDetails;
```

And make sure you have the corresponding types defined in `src/types/team/department.types.ts`:

```typescript
export interface Department {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  subDepartments?: Department[];
  members?: DepartmentMember[];
}

export interface DepartmentMember {
  id: string;
  name: string;
  role: string;
  email: string;
  joinedAt: string;
}
```

This component provides:
1. Basic department information display
2. Department statistics
3. Member listing
4. Edit/Delete functionality
5. Warning for departments with members
6. Responsive layout

Would you like me to:
1. Add more features to the component
2. Create additional department-related components
3. Add animation effects
4. Something else?
