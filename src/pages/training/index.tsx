import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Play, Lock, CheckCircle, Download, Clock } from 'lucide-react';

const TrainingModules = () => {
  const [modules, setModules] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(null);

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      const [modulesRes, progressRes] = await Promise.all([
        fetch('/api/training/modules'),
        fetch('/api/training/progress')
      ]);

      const [modulesData, progressData] = await Promise.all([
        modulesRes.json(),
        progressRes.json()
      ]);

      setModules(modulesData);
      setUserProgress(progressData);
    } catch (error) {
      console.error('Error fetching training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startModule = async (moduleId) => {
    try {
      const response = await fetch('/api/training/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId })
      });
      
      if (response.ok) {
        setActiveModule(moduleId);
      }
    } catch (error) {
      console.error('Error starting module:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-custom-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="heading-1">Training Modules</h1>
          <p className="subtitle">Complete your required training modules and track your progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const progress = userProgress[module.id] || 0;
            const isLocked = module.tier && !module.isAccessible;
            
            return (
              <Card 
                key={module.id}
                className={`bg-gray-800/50 border-gray-700 ${
                  isLocked ? 'opacity-75' : ''
                }`}
              >
                <div className="relative">
                  <div className="aspect-video bg-gray-700 rounded-t-lg overflow-hidden">
                    {module.thumbnail && (
                      <img
                        src={module.thumbnail}
                        alt={module.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <Lock className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                      <div
                        className="h-full bg-custom-green transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-white">{module.title}</h3>
                      <p className="text-sm text-gray-400">{module.duration} minutes</p>
                    </div>
                    {module.tier && (
                      <span className="badge badge-purple">{module.tier}</span>
                    )}
                  </div>

                  <p className="text-sm text-gray-400 mb-4">{module.description}</p>

                  <div className="space-y-2">
                    {module.topics.map((topic, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-custom-green" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    {isLocked ? (
                      <button className="btn-secondary w-full opacity-75" disabled>
                        <Lock className="w-4 h-4 mr-2" />
                        Upgrade to Access
                      </button>
                    ) : (
                      <button 
                        onClick={() => startModule(module.id)}
                        className="btn-primary w-full"
                      >
                        {progress > 0 ? (
                          <>
                            <Clock className="w-4 h-4 mr-2" />
                            Continue ({progress}%)
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start Module
                          </>
                        )}
                      </button>
                    )}
                    
                    {module.resources && (
                      <button className="btn-secondary p-2">
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Video Player Modal */}
      {activeModule && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="max-w-4xl w-full mx-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-0">
                <div className="aspect-video">
                  <iframe
                    src={`/api/training/video/${activeModule}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingModules;
