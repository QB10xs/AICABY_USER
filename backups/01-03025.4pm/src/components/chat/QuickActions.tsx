import React from 'react';
import { MapPin, Camera, Map, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

interface QuickActionsProps {
  onAction: (action: { id: string; label: string }) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    { id: 'location', icon: <MapPin className="w-5 h-5" />, label: 'Location' },
    { id: 'photo', icon: <Camera className="w-5 h-5" />, label: 'Photo' },
    { id: 'map', icon: <Map className="w-5 h-5" />, label: 'Map' },
    { id: 'payment', icon: <CreditCard className="w-5 h-5" />, label: 'Payment' },
  ];

  return (
    <GlassCard className="max-w-xl mx-auto overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4"
      >
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => onAction(action)}
              className="px-4 py-2 bg-taxi-yellow/10 hover:bg-taxi-yellow/20 
                         text-taxi-yellow rounded-lg transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      </motion.div>
    </GlassCard>

  );
};

export default QuickActions; 