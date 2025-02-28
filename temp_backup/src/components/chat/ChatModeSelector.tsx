import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export interface ChatMode {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ChatStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface ChatModeSelectorProps {
  selectedMode: ChatMode;
  selectedStyle: ChatStyle;
  onModeChange: (mode: ChatMode) => void;
  onStyleChange: (style: ChatStyle) => void;
}

export const chatModes: ChatMode[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Formal and efficient communication',
    icon: '👔'
  },
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Casual and approachable interaction',
    icon: '😊'
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Detailed technical assistance',
    icon: '🎓'
  }
];

export const chatStyles: ChatStyle[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and minimalist design',
    icon: '🎨'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional chat interface',
    icon: '📱'
  },
  {
    id: 'futuristic',
    name: 'Futuristic',
    description: 'Advanced UI with animations',
    icon: '🚀'
  }
];

const ChatModeSelector: React.FC<ChatModeSelectorProps> = ({
  selectedMode,
  selectedStyle,
  onModeChange,
  onStyleChange
}) => {
  const [isModeOpen, setIsModeOpen] = React.useState(false);
  const [isStyleOpen, setIsStyleOpen] = React.useState(false);

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div className="text-center mb-2">
        <h3 className="text-white/80 text-sm font-medium">Customize your AI CABY experience</h3>
      </div>
      <div className="flex gap-4">
        {/* Mode Selector */}
        <div className="relative flex-1">
          <button
            onClick={() => setIsModeOpen(!isModeOpen)}
            className="w-full px-4 py-3 bg-night-black/50 hover:bg-night-black/70 
                     text-white rounded-xl backdrop-blur-md border border-taxi-yellow/20
                     flex items-center justify-between transition-all duration-200
                     hover:border-taxi-yellow/40"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedMode.icon}</span>
              <div className="text-left">
                <div className="font-medium">{selectedMode.name}</div>
                <div className="text-xs text-gray-400">Assistant Mode</div>
              </div>
            </div>
            <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 
              ${isModeOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Mode Dropdown */}
          {isModeOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-night-black/90 backdrop-blur-xl
                       rounded-xl border border-taxi-yellow/20 overflow-hidden shadow-lg"
            >
              {chatModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    onModeChange(mode);
                    setIsModeOpen(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-taxi-yellow/10
                           transition-colors duration-200 ${
                             selectedMode.id === mode.id ? 'bg-taxi-yellow/20' : ''
                           }`}
                >
                  <span className="text-xl">{mode.icon}</span>
                  <div className="text-left">
                    <div className="text-white font-medium">{mode.name}</div>
                    <div className="text-sm text-zinc-400">{mode.description}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Style Selector */}
        <div className="relative flex-1">
          <button
            onClick={() => setIsStyleOpen(!isStyleOpen)}
            className="w-full px-4 py-3 bg-night-black/50 hover:bg-night-black/70 
                     text-white rounded-xl backdrop-blur-md border border-taxi-yellow/20
                     flex items-center justify-between transition-all duration-200
                     hover:border-taxi-yellow/40"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedStyle.icon}</span>
              <div className="text-left">
                <div className="font-medium">{selectedStyle.name}</div>
                <div className="text-xs text-gray-400">Interface Style</div>
              </div>
            </div>
            <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 
              ${isStyleOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Style Dropdown */}
          {isStyleOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-night-black/90 backdrop-blur-xl
                       rounded-xl border border-taxi-yellow/20 overflow-hidden shadow-lg"
            >
              {chatStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    onStyleChange(style);
                    setIsStyleOpen(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-taxi-yellow/10
                           transition-colors duration-200 ${
                             selectedStyle.id === style.id ? 'bg-taxi-yellow/20' : ''
                           }`}
                >
                  <span className="text-xl">{style.icon}</span>
                  <div className="text-left">
                    <div className="text-white font-medium">{style.name}</div>
                    <div className="text-sm text-zinc-400">{style.description}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModeSelector; 