import React from 'react';
import { GlassCard } from './GlassCard';

interface LoadingStateProps {
  type?: 'message' | 'card' | 'action';
  count?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'message',
  count = 1,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'message':
        return (
          <div className="flex items-start gap-3 w-full">
            <div className="w-8 h-8 rounded-full loading-skeleton"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 loading-skeleton rounded"></div>
              <div className="h-4 w-full loading-skeleton rounded"></div>
            </div>
          </div>
        );
      
      case 'card':
        return (
          <GlassCard className="p-4 space-y-3">
            <div className="h-6 w-1/3 loading-skeleton rounded"></div>
            <div className="h-4 w-full loading-skeleton rounded"></div>
            <div className="h-4 w-2/3 loading-skeleton rounded"></div>
          </GlassCard>
        );
      
      case 'action':
        return (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full loading-skeleton"></div>
            <div className="h-4 w-20 loading-skeleton rounded"></div>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
