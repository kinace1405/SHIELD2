import { useState, useEffect } from 'react';
import { useTeamMembers } from '@/hooks/team/useTeamMembers';
import { useRoles } from '@/hooks/team/useRoles';
import { useDepartments } from '@/hooks/team/useDepartments';
import MemberList from '@/components/team/members/MemberList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { 
  UserPlus, 
  Download, 
  Upload,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/router';
import BulkImportModal from '@/components/team/members/BulkImportModal';

const TeamMembers = () => {
  const router = useRouter();
  const { members, loading, refreshMembers } = useTeamMembers();
  const { roles } = useRoles();
  const { departments } = useDepartments();
  
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    role: '',
    status: ''
  });
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });

  useEffect(() => {
    if (members) {
      let filtered = [...members];

      // Apply filters
      if (filters.search) {
        filtered = filtered.filter(member => 
          member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          member.email.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.department) {
        filtered = filtered.filter(member => 
          member.department === filters.department
        );
      }

      if (filters.role) {
        filtered = filtered.filter(member => 
          member.role === filters.role
        );
      }

      if (filters.status) {
        filtered = filtered.filter(member => 
          member.status === filters.status
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });

      setFilteredMembers(filtered);
    }
  }, [members, filters, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/team/members/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters })
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'team-members.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting members:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Team Members</h1>
            <p className="text-gray-400">
              Manage your team members, roles, and permissions
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowBulkImport(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Bulk Import
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              onClick={() => router.push('/team/members/invite')}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    search: e.target.value
                  }))}
                />
              </div>
              <Select
                value={filters.department}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  department: e.target.value
                }))}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </Select>
              <Select
                value={filters.role}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  role: e.target.value
                }))}
              >
                <option value="">All Roles</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Select>
              <Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  status: e.target.value
                }))}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="invited">Invited</option>
                <option value="suspended">Suspended</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Member List */}
        <MemberList
          members={filteredMembers}
          loading={loading}
          onSort={handleSort}
          sortConfig={sortConfig}
        />

        {/* Bulk Import Modal */}
        {showBulkImport && (
          <BulkImportModal
            onClose={() => setShowBulkImport(false)}
            onSuccess={() => {
              setShowBulkImport(false);
              refreshMembers();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TeamMembers;
