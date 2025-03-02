import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare } from 'lucide-react';

interface DetailsStepProps {
  formData: {
    passengers: number;
    specialRequirements: string;
  };
  onChange: (data: Partial<{ passengers: number; specialRequirements: string }>) => void;
}

export const DetailsStep: React.FC<DetailsStepProps> = ({ formData, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-taxi-yellow">
          <Users className="w-4 h-4" />
          Number of Passengers
        </label>
        <input 
          type="number"
          min="1"
          max="8"
          value={formData.passengers}
          onChange={(e) => onChange({ passengers: parseInt(e.target.value) })}
          className="w-full bg-night-black/20 border border-taxi-yellow/20 
                   rounded-lg px-4 py-2 text-white placeholder-white/50
                   focus:border-taxi-yellow focus:outline-none"
        />
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-taxi-yellow">
          <MessageSquare className="w-4 h-4" />
          Special Requirements
        </label>
        <textarea 
          value={formData.specialRequirements}
          onChange={(e) => onChange({ specialRequirements: e.target.value })}
          placeholder="Any special requirements? (e.g., wheelchair access, child seat, etc.)"
          className="w-full h-32 bg-night-black/20 border border-taxi-yellow/20 
                   rounded-lg px-4 py-2 text-white placeholder-white/50
                   focus:border-taxi-yellow focus:outline-none resize-none"
        />
      </div>

      <div className="mt-4 p-4 bg-night-black/10 rounded-lg">
        <h4 className="text-taxi-yellow font-medium mb-2">Available Services</h4>
        <ul className="text-sm text-white/70 space-y-1">
          <li>• Wheelchair accessible vehicles</li>
          <li>• Child seats (upon request)</li>
          <li>• Extra luggage space</li>
          <li>• Pet-friendly vehicles</li>
        </ul>
      </div>
    </motion.div>
  );
};
