import React from 'react';
import { MapPin, Camera, Map, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg transition-all"
  >
    <div className="text-taxi-yellow">{icon}</div>
    <span className="text-sm text-white/80">{label}</span>
  </motion.button>
);

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    { id: 'location', icon: <MapPin className="w-4 h-4" />, label: 'Location' },
    { id: 'photo', icon: <Camera className="w-4 h-4" />, label: 'Photo' },
    { id: 'map', icon: <Map className="w-4 h-4" />, label: 'Map' },
    { id: 'payment', icon: <CreditCard className="w-4 h-4" />, label: 'Payment' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1 p-1 max-w-xl mx-auto bg-night-black/30 backdrop-blur-sm rounded-lg border border-white/5"
    >
      {actions.map((action) => (
        <ActionButton
          key={action.id}
          icon={action.icon}
          label={action.label}
          onClick={() => onAction(action.id)}
        />
      ))}
    </motion.div>
  );
};

export default QuickActions; 