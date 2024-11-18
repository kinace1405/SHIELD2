import { useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { 
  CheckCircle, 
  Circle, 
  Clock,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { UserProgress, CertificationStatus } from '@/types/training.types';

interface ProgressTrackerProps {
  progress: UserProgress;
  totalModules: number;
  certifications: CertificationStatus[];
}

const ProgressTracker = ({ 
  progress, 
  totalModules,
  certifications 
}: ProgressTrackerProps) => {
  const stats = useMemo(() => {
    const completedModules = Object.values(progress).filter(p => p === 100).length;
    const inProgressModules = Object.values(progress).filter(p => p > 0 && p < 100).length;
    const completionRate = (completedModules / totalModules) * 100;
    const activeCertifications = certifications.filter(c => c.status === 'active').length;
    const expiringCertifications = certifications.filter(c => {
      const expiryDate = new Date(c.expiryDate);
      const monthAway = new Date();
      monthAway.setMonth(monthAway.getMonth() + 1);
      return expiryDate <= monthAway && c.status === 'active';
    }).length;

    return {
      completedModules,
      inProgressModules,
      completionRate,
      activeCertifications,
      expiringCertifications
    };
  }, [progress, totalModules, certifications]);

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <h3 className="text-lg font-medium text-white">Training Progress</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Overall Completion</span>
              <span className="text-white">{Math.round(stats.completionRate)}%</span>
            </div>
            <Progress 
              value={stats.completionRate}
              className="h-2 bg-gray-700"
            />
          </div>

          {/* Module Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-custom-green" />
                <span className="text-gray-300">Completed</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats.completedModules}
              </p>
              <p className="text-sm text-gray-400">modules</p>
            </div>

            <div className="p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-custom-purple" />
                <span className="text-gray-300">In Progress</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats.inProgressModules}
              </p>
              <p className="text-sm text-gray-400">modules</p>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-custom-purple" />
                <span className="text-white">Active Certifications</span>
              </div>
              <span className="text-xl font-bold text-white">
                {stats.activeCertifications}
              </span>
            </div>

            {stats.expiringCertifications > 0 && (
              <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-3 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
                <span>
                  {stats.expiringCertifications} certification{stats.expiringCertifications > 1 ? 's' : ''} expiring soon
                </span>
              </div>
            )}
          </div>

          {/* Module List */}
          <div className="space-y-2">
            <h4 className="text-white font-medium">Module Status</h4>
            {Object.entries(progress).map(([moduleId, value]) => (
              <div 
                key={moduleId}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-700/50"
              >
                <div className="flex items-center gap-2">
                  {value === 100 ? (
                    <CheckCircle className="w-4 h-4 text-custom-green" />
                  ) : value > 0 ? (
                    <Clock className="w-4 h-4 text-custom-purple" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-gray-300">Module {moduleId}</span>
                </div>
                <span className="text-sm text-gray-400">{value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
