import { useState, useEffect } from 'react';
import { useDepartments } from '@/hooks/team/useDepartments';
import DepartmentTree from '@/components/team/departments/DepartmentTree';
import DepartmentEditor from '@/components/team/departments/DepartmentEditor';
import MemberAssignment from '@/components/team/departments/MemberAssignment';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2,
  Plus,
  Users,
  AlertCircle,
  ChevronRight,
  Organization,
  Settings
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Department } from '@/types/team/department.types';

const DepartmentsPage = () => {
  const { 
    departments, 
    loading, 
    error, 
    createDepartment, 
    updateDepartment, 
    deleteDepartment 
  } = useDepartments();
  
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMemberAssignment, setShowMemberAssignment] = useState(false);
  const [stats, setStats] = useState({
    totalDepartments: 0,
    totalMembers: 0,
    avgMembersPerDepartment: 0,
    maxDepth: 0
  });

  useEffect(() => {
    if (departments) {
      calculateStats();
    }
  }, [departments]);

  const calculateStats = () => {
    const totalMembers = departments.reduce((sum, dept) => sum + dept.memberCount, 0);
    setStats({
      totalDepartments: departments.length,
      totalMembers,
      avgMembersPerDepartment: Math.round(totalMembers / departments.length),
      maxDepth: calculateMaxDepth(departments)
    });
  };

  const calculateMaxDepth = (depts: Department[], parentId: string | null = null, depth = 0): number => {
    const children = depts.filter(d => d.parentId === parentId);
    if (children.length === 0) return depth;
    return Math.max(...children.map(child => 
      calculateMaxDepth(depts, child.id, depth + 1)
    ));
  };

  const handleCreateDepartment = (parentId?: string) => {
    setSelectedDepartment(null);
    setIsEditing(true);
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditing(true);
  };

  const handleSaveDepartment = async (departmentData: Partial<Department>) => {
    try {
      if (selectedDepartment) {
        await updateDepartment(selectedDepartment.id, departmentData);
      } else {
        await createDepartment(departmentData);
      }
      setIsEditing(false);
      setSelectedDepartment(null);
    } catch (err) {
      console.error('Error saving department:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Department Management</h1>
            <p className="text-gray-400">
              Organize your team structure and manage departments
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowMemberAssignment(true)}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Assign Members
            </Button>
            <Button
              onClick={() => handleCreateDepartment()}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Department
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Total Departments</p>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {stats.totalDepartments}
                  </h3>
                </div>
                <Building2 className="w-8 h-8 text-custom-purple" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Total Members</p>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {stats.totalMembers}
                  </h3>
                </div>
                <Users className="w-8 h-8 text-custom-purple" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Avg. Members</p>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {stats.avgMembersPerDepartment}
                  </h3>
                </div>
                <Organization className="w-8 h-8 text-custom-purple" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Hierarchy Depth</p>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {stats.maxDepth}
                  </h3>
                </div>
                <Settings className="w-8 h-8 text-custom-purple" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Tree */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <h2 className="text-lg font-medium text-white">
                  Department Structure
                </h2>
              </CardHeader>
              <CardContent>
                <DepartmentTree
                  departments={departments}
                  selectedDepartment={selectedDepartment}
                  onSelect={setSelectedDepartment}
                  onEdit={handleEditDepartment}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>

          {/* Department Details/Editor */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-white">
                    {isEditing 
                      ? (selectedDepartment ? 'Edit Department' : 'Create Department')
                      : 'Department Details'
                    }
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <DepartmentEditor
                    department={selectedDepartment}
                    departments={departments}
                    onSave={handleSaveDepartment}
                    onCancel={() => {
                      setIsEditing(false);
                      setSelectedDepartment(null);
                    }}
                  />
                ) : selectedDepartment ? (
                  <DepartmentDetails
                    department={selectedDepartment}
                    onEdit={() => setIsEditing(true)}
                    onDelete={() => handleDeleteDepartment(selectedDepartment.id)}
                  />
                ) : (
                  <div className="text-center text-gray-400 py-12">
                    Select a department to view details or create a new one
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Member Assignment Modal */}
      {showMemberAssignment && (
        <MemberAssignment
          departments={departments}
          onClose={() => setShowMemberAssignment(false)}
        />
      )}
    </div>
  );
};

export default DepartmentsPage;
