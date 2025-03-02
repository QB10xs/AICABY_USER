import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import type { SmartSuggestion } from '@/services/smartSuggestions';

interface SmartSuggestionsProps {
  suggestions: SmartSuggestion[];
  onSuggestionClick: (suggestion: SmartSuggestion) => void;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  suggestions,
  onSuggestionClick
}) => {
  if (!suggestions.length) return null;

  return (
    <div className="space-y-2 max-w-xl mx-auto">
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={`${suggestion.type}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard
            className="p-4 cursor-pointer group"
            interactive
            onClick={() => onSuggestionClick(suggestion)}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl bg-taxi-yellow/10 p-2 rounded-full">
                {suggestion.suggestion.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-primary-light dark:text-text-primary-dark group-hover:text-taxi-yellow transition-colors">
                  {suggestion.suggestion.text}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {suggestion.type === 'weather' && suggestion.context.weather && (
                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      {suggestion.context.weather.temperature}°C • {suggestion.context.weather.description}
                    </span>
                  )}
                  {suggestion.type === 'time' && (
                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark capitalize">
                      {suggestion.context.timeOfDay}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};

export default SmartSuggestions;
