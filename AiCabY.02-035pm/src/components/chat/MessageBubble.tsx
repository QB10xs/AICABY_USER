import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useDarkMode } from '@/hooks/useDarkMode';

interface MessageBubbleProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  sender,
  timestamp
}) => {
  const { isDarkMode } = useDarkMode();
  const isAI = sender === 'ai';

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <GlassCard
        className={`
          max-w-[80%] p-4
          ${isAI ? 'mr-auto' : 'ml-auto'}
          ${isAI ? 'bg-taxi-yellow/10' : ''}
        `}
      >
        <div className="flex flex-col">
          <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
            {content}
          </p>
          <span className="text-xs text-zinc-500 mt-2">
            {timestamp}
          </span>
        </div>
      </GlassCard>
    </div>
  );
};
