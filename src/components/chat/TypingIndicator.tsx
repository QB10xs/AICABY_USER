import React, { useEffect, useState } from 'react';
import { GlassCard } from '../ui/GlassCard';

const thinkingPhrases = {
  default: [
    'AI CABY is thinking...',
    'Processing your request...',
    'Finding the best route...',
    'Calculating options...'
  ],
  booking: [
    'Checking available drivers...',
    'Finding the best match...',
    'Calculating optimal route...',
    'Preparing your booking...'
  ]
};

interface TypingIndicatorProps {
  mode?: 'default' | 'booking';
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ mode = 'default' }) => {
  const phrases = thinkingPhrases[mode];
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase(prev => {
        const currentIndex = phrases.indexOf(prev);
        return phrases[(currentIndex + 1) % phrases.length];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  return (
    <GlassCard 
      className="inline-flex items-center gap-3 py-2 px-4 animate-fade-in relative overflow-hidden"
      style={{
        background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.4) 100%)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-taxi-yellow rounded-full animate-typing" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-taxi-yellow rounded-full animate-typing" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-taxi-yellow rounded-full animate-typing" style={{ animationDelay: '300ms' }} />
      </div>
      <span 
        className="text-sm text-text-primary-light dark:text-text-primary-dark min-w-[150px]"
        style={{ opacity: 0.9 }}
      >
        {currentPhrase}
      </span>
      
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 -z-10" 
        style={{
          background: 'linear-gradient(45deg, rgba(255,204,0,0.1) 0%, rgba(255,204,0,0) 100%)',
          animation: 'gradient-shift 2s ease infinite',
        }}
      />
    </GlassCard>
  );
};

export default TypingIndicator; 