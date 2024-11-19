import { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings 
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VideoPlayerProps {
  src: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  startTime?: number;
}

const VideoPlayer = ({ 
  src, 
  title,
  onProgress,
  onComplete,
  startTime = 0 
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [quality, setQuality] = useState('auto');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = startTime;

    const hideControlsTimer = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);

    return () => clearTimeout(hideControlsTimer);
  }, [startTime, playing]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setCurrentTime(time);
      
      const progress = (time / duration) * 100;
      if (onProgress) onProgress(progress);

      if (progress >= 100 && onComplete) {
        onComplete();
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      const time = (value / 100) * duration;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="relative group"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video rounded-lg"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Video Controls */}
      <div className={`
        absolute bottom-0 left-0 right-0 p-4
        bg-gradient-to-t from-black/80 to-transparent
        transition-opacity duration-300
        ${showControls ? 'opacity-100' : 'opacity-0'}
      `}>
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={([value]) => handleSeek(value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-custom-purple transition-colors"
            >
              {playing ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMuted(!muted)}
                className="text-white hover:text-custom-purple transition-colors"
              >
                {muted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
              <Slider
                value={[muted ? 0 : volume * 100]}
                max={100}
                step={1}
                onValueChange={([value]) => handleVolumeChange(value / 100)}
                className="w-24"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Playback Speed */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-white hover:text-custom-purple transition-colors">
                  <Settings className="w-6 h-6" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-2">
                  <div className="text-sm font-medium text-white mb-2">
                    Playback Speed
                  </div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <DropdownMenuItem
                      key={speed}
                      onClick={() => {
                        setPlaybackSpeed(speed);
                        if (videoRef.current) {
                          videoRef.current.playbackRate = speed;
                        }
                      }}
                    >
                      {speed}x {speed === playbackSpeed && '✓'}
                    </DropdownMenuItem>
                  ))}
                </div>

                <div className="p-2 border-t border-gray-700">
                  <div className="text-sm font-medium text-white mb-2">
                    Quality
                  </div>
                  {['auto', '1080p', '720p', '480p'].map((q) => (
                    <DropdownMenuItem
                      key={q}
                      onClick={() => setQuality(q)}
                    >
                      {q} {q === quality && '✓'}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fullscreen */}
            <button
              onClick={() => videoRef.current?.requestFullscreen()}
              className="text-white hover:text-custom-purple transition-colors"
            >
              <Maximize className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
