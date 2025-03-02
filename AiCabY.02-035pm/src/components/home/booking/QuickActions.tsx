import React from 'react';
import { motion } from 'framer-motion';
import { Car, Clock, DollarSign, MapPin } from 'lucide-react';

interface QuickActionProps {
  onAction: (action: 'book' | 'schedule' | 'estimate' | 'places') => void;
}

const actions = [
  {
    id: 'book',
    icon: Car,
    label: 'Book Now',
    color: 'bg-yellow-500 hover:bg-yellow-600'
  },
  {
    id: 'schedule',
    icon: Clock,
    label: 'Schedule',
    color: 'bg-zinc-800 hover:bg-zinc-700'
  },
  {
    id: 'estimate',
    icon: DollarSign,
    label: 'Estimate',
    color: 'bg-zinc-800 hover:bg-zinc-700'
  },
  {
    id: 'places',
    icon: MapPin,
    label: 'Places',
    color: 'bg-zinc-800 hover:bg-zinc-700'
  }
];

const QuickActions: React.FC<QuickActionProps> = ({ onAction }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-4 md:grid-cols-4 mt-6"
    >
      {actions.map(({ id, icon: Icon, label, color }) => (
        <motion.button
          key={id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${color} p-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition-colors duration-200`}
          onClick={() => onAction(id as any)}
        >
          <Icon className="w-6 h-6 text-white" />
          <span className="text-sm font-medium text-white">{label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default QuickActions;
