import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

interface TimeStepProps {
  formData: {
    date: string;
    time: string;
  };
  onChange: (data: Partial<{ date: string; time: string }>) => void;
}

export const TimeStep: React.FC<TimeStepProps> = ({ formData, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-taxi-yellow">
          <Calendar className="w-4 h-4" />
          Pickup Date
        </label>
        <input 
          type="date"
          value={formData.date}
          onChange={(e) => onChange({ date: e.target.value })}
          className="w-full bg-night-black/20 border border-taxi-yellow/20 
                   rounded-lg px-4 py-2 text-white placeholder-white/50
                   focus:border-taxi-yellow focus:outline-none"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-taxi-yellow">
          <Clock className="w-4 h-4" />
          Pickup Time
        </label>
        <input 
          type="time"
          value={formData.time}
          onChange={(e) => onChange({ time: e.target.value })}
          className="w-full bg-night-black/20 border border-taxi-yellow/20 
                   rounded-lg px-4 py-2 text-white placeholder-white/50
                   focus:border-taxi-yellow focus:outline-none"
        />
      </div>

      <div className="mt-4 p-4 bg-night-black/10 rounded-lg">
        <h4 className="text-taxi-yellow font-medium mb-2">Booking Tips</h4>
        <ul className="text-sm text-white/70 space-y-1">
          <li>• Book at least 30 minutes in advance</li>
          <li>• Peak hours may require longer wait times</li>
          <li>• Pre-book up to 7 days in advance</li>
        </ul>
      </div>
    </motion.div>
  );
};
