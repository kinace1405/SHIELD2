import { Role } from '@/types/team/role.types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface RoleEditorProps {
  role: Partial<Role> | null;
  onChange: (role: Partial<Role>) => void;
}

const RoleEditor = ({ role, onChange }: RoleEditorProps) => {
  if (!role) return null;

  const handleChange = (field: string, value: any) => {
    onChange({ ...role, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white">Role Name</Label>
        <Input
          value={role.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter role name"
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-white">Description</Label>
        <Textarea
          value={role.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter role description"
          className="mt-1"
          rows={3}
        />
      </div>
    </div>
  );
};

export default RoleEditor;
