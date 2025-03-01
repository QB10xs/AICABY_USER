import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, FileText } from 'lucide-react';

interface BookingModeToggleProps {
  mode: 'ai' | 'manual';
  onModeChange: (mode: 'ai' | 'manual') => void;
}

const BookingModeToggle: React.FC<BookingModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-zinc-50/5 backdrop-blur-sm rounded-lg mb-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onModeChange('ai')}
        className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
          mode === 'ai' 
            ? 'bg-taxi-yellow text-night-black' 
            : 'bg-night-black/20 text-taxi-yellow hover:bg-night-black/30'
        }`}
      >
        <MessageSquare className="w-4 h-4" />
        AI Booking
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onModeChange('manual')}
        className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
          mode === 'manual' 
            ? 'bg-taxi-yellow text-night-black' 
            : 'bg-night-black/20 text-taxi-yellow hover:bg-night-black/30'
        }`}
      >
        <FileText className="w-4 h-4" />
        Manual Booking
      </motion.button>
    </div>
  );
};

export default BookingModeToggle;
