import React from 'react';
import { GlassCard } from './GlassCard';

interface FeedbackToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ'
};

const colors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-taxi-yellow'
};

export const FeedbackToast: React.FC<FeedbackToastProps> = ({
  type,
  message,
  onClose
}) => {
  React.useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  return (
    <GlassCard 
      className={`
        fixed bottom-4 right-4 z-50
        flex items-center gap-3 py-3 px-4
        animate-scale-in cursor-pointer
        hover:scale-105 transition-transform
        ${type === 'success' && 'animate-pulse'}
      `}
      onClick={onClose}
    >
      <div className={`
        w-6 h-6 rounded-full ${colors[type]}
        flex items-center justify-center text-white
        text-sm font-bold
      `}>
        {icons[type]}
      </div>
      <p className="text-sm text-text-primary-light dark:text-text-primary-dark">
        {message}
      </p>
    </GlassCard>
  );
};

export default FeedbackToast;
