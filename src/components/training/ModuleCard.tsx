import { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  Award, 
  Lock,
  FileText,
  Users
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrainingModule } from '@/types/training.types';
import Image from 'next/image';

interface ModuleCardProps {
  module: TrainingModule;
  progress?: number;
  isLocked?: boolean;
  onStart?: (moduleId: string) => void;
}

const ModuleCard = ({ 
  module, 
  progress = 0, 
  isLocked = false,
  onStart 
}: ModuleCardProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (isLocked) return;
    
    setLoading(true);
    try {
      if (onStart) {
        await onStart(module.id);
      }
      router.push(`/training/modules/${module.id}`);
    } catch (error) {
      console.error('Error starting module:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`bg-gray-800/50 border-gray-700 ${
      isLocked ? 'opacity-75' : 'hover:border-custom-purple transition-all'
    }`}>
      <div className="relative">
        <div className="aspect-video bg-gray-700 rounded-t-lg overflow-hidden">
          {module.thumbnail && (
            <Image
              src={module.thumbnail}
              alt={module.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={false}
            />
          )}
          {isLocked ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Lock className="w-12 h-12 text-gray-400" />
            </div>
          ) : progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
              <div
                className="h-full bg-custom-green transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-white">{module.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">{module.duration} minutes</span>
            </div>
          </div>
          <div className="flex gap-2">
            {module.certification && (
              <Badge variant="purple">
                <Award className="w-4 h-4 mr-1" />
                Certification
              </Badge>
            )}
            <Badge variant="secondary">
              {module.level}
            </Badge>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4">
          {module.description}
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Users className="w-4 h-4 text-gray-400" />
            {module.prerequisites.length > 0 ? (
              <span>Requires: {module.prerequisites.join(', ')}</span>
            ) : (
              <span>No prerequisites</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <FileText className="w-4 h-4 text-gray-400" />
            <span>{module.content.length} lessons</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {progress > 0 && !isLocked && (
              <>
                <CheckCircle className="w-4 h-4 text-custom-green" />
                <span className="text-sm text-gray-400">
                  {progress}% Complete
                </span>
              </>
            )}
          </div>
          <Button
            onClick={handleStart}
            disabled={isLocked || loading}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {progress > 0 ? 'Continue' : 'Start Module'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
