import { useState, useEffect } from 'react';
import { useTeamMembers } from '@/hooks/team/useTeamMembers';
import { useTeamActivity } from '@/hooks/team/useTeamActivity';
import TeamHeader from '@/components/team/shared/TeamHeader';
import TeamStats from '@/components/team/shared/TeamStats';
import ActivityFeed from '@/components/team/shared/ActivityFeed';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserPlus, 
  Building2, 
  Shield,
  Activity,
  Settings 
} from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';

const TeamDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { teamMembers, loading: membersLoading } = useTeamMembers();
  const { activities, loading: activitiesLoading } = useTeamActivity();
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembersToday: 0,
    departments: 0,
    pendingInvites: 0
  });

  useEffect(() => {
    if (teamMembers) {
      setStats({
        totalMembers: teamMembers.length,
        activeMembersToday: teamMembers.filter(m => m.lastActive > new Date(Date.now() - 86400000)).length,
        departments: new Set(teamMembers.map(m => m.department)).size,
        pendingInvites: teamMembers.filter(m => m.status === 'invited').length
      });
    }
  }, [teamMembers]);

  if (membersLoading || activitiesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <TeamHeader />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800/50 border-gray-700 hover:border-custom-purple transition-all cursor-pointer"
                onClick={() => router.push('/team/members')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Team Members</h3>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalMembers}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {stats.activeMembersToday} active today
                  </p>
                </div>
                <Users className="w-8 h-8 text-custom-purple" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-custom-purple transition-all cursor-pointer"
                onClick={() => router.push('/team/members/invite')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Pending Invites</h3>
                  <p className="text-3xl font-bold text-white mt-2">{stats.pendingInvites}</p>
                  <p className="text-sm text-gray-400 mt-1">Click to invite members</p>
                </div>
                <UserPlus className="w-8 h-8 text-custom-purple" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-custom-purple transition-all cursor-pointer"
                onClick={() => router.push('/team/departments')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Departments</h3>
                  <p className="text-3xl font-bold text-white mt-2">{stats.departments}</p>
                  <p className="text-sm text-gray-400 mt-1">Active departments</p>
                </div>
                <Building2 className="w-8 h-8 text-custom-purple" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:border-custom-purple transition-all cursor-pointer"
                onClick={() => router.push('/team/roles')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Roles & Access</h3>
                  <p className="text-sm text-gray-400 mt-1">Manage permissions</p>
                </div>
                <Shield className="w-8 h-8 text-custom-purple" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Stats and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TeamStats stats={stats} />
          </div>
          <div>
            <ActivityFeed activities={activities.slice(0, 5)} />
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="flex gap-4 justify-end">
          <Button 
            variant="outline"
            onClick={() => router.push('/team/settings')}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Team Settings
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/team/settings/audit-log')}
            className="flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            View Audit Log
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
