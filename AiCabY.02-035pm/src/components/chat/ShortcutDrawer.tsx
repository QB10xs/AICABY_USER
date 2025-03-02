import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShortcutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { id: 'location', icon: '📍', label: 'Location', color: 'bg-blue-500/10 text-blue-400' },
  { id: 'photo', icon: '📷', label: 'Photo', color: 'bg-purple-500/10 text-purple-400' },
  { id: 'map', icon: '🗺️', label: 'Map', color: 'bg-green-500/10 text-green-400' },
  { id: 'payment', icon: '💳', label: 'Payment', color: 'bg-yellow-500/10 text-yellow-400' },
  { id: 'location', icon: '📍', label: 'Location' },
  { id: 'photo', icon: '📸', label: 'Photo' },
  { id: 'map', icon: '🗺️', label: 'Map' },
  { id: 'payment', icon: '💳', label: 'Payment' },
];

export const ShortcutDrawer: React.FC<ShortcutDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute bottom-full left-0 right-0 bg-night-black/95 backdrop-blur-lg rounded-t-2xl overflow-hidden border-t border-white/5 shadow-2xl"
        >
          <div className="p-4">
            <div className="flex justify-between mb-2">
              <div className="flex-1"></div>
              <div className="w-12 h-1 bg-zinc-700 rounded-full"></div>
              <div className="flex-1 flex justify-end">
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <span className="text-zinc-400 text-sm">✕</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {shortcuts.map((shortcut) => (
                <motion.button
                  key={shortcut.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl ${shortcut.color} hover:bg-white/5 transition-all`}
                >
                  <span className="text-2xl filter drop-shadow-lg">{shortcut.icon}</span>
                  <span className="text-sm font-medium">{shortcut.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};