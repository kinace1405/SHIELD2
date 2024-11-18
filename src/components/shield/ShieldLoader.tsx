import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ShieldLoader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [scale, setScale] = useState(1);
  const router = useRouter();

  useEffect(() => {
    // Only show on SHIELD page
    if (!router.pathname.includes('/shield')) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setScale(0);
      setTimeout(() => setIsVisible(false), 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router.pathname]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
      <div 
        className="transition-transform duration-1000"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Using the provided SHIELD logo */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" className="w-64 h-64">
          <defs>
            <linearGradient id="shieldGradient" gradientTransform="rotate(45)">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#7C3AED" floodOpacity="0.5" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Shield Base */}
          <path 
            d="M0 180 L150 80 L300 180 L150 180 Z M150 180 L280 100 L400 180 L150 180 Z"
            fill="#808080"
            className="animate-pulse"
          />
          
          {/* Circuit Pattern */}
          <g stroke="rgba(124, 58, 237, 0.6)" strokeWidth="1" fill="none">
            <path d="M200 50 C100 70, 300 70, 400 50" className="animate-pulse" />
            <path d="M0 100 C100 120, 300 120, 400 100" className="animate-pulse" />
            <path d="M0 150 C100 170, 300 170, 400 150" className="animate-pulse" />
          </g>
          
          {/* Center Eye */}
          <circle 
            cx="200" 
            cy="150" 
            r="30" 
            fill="#60A5FA"
            filter="url(#glow)"
            className="animate-pulse"
          />
          
          {/* Network Nodes */}
          <g fill="#7C3AED" className="animate-pulse">
            <circle cx="100" cy="100" r="5" />
            <circle cx="300" cy="100" r="5" />
            <circle cx="200" cy="80" r="5" />
            <circle cx="150" cy="150" r="5" />
            <circle cx="250" cy="150" r="5" />
          </g>
          
          {/* Connecting Lines */}
          <g stroke="#7C3AED" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse">
            <line x1="100" y1="100" x2="200" y2="150" />
            <line x1="300" y1="100" x2="200" y2="150" />
            <line x1="200" y1="80" x2="200" y2="150" />
            <line x1="150" y1="150" x2="250" y2="150" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ShieldLoader;
