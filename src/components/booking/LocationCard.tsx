import React from 'react';
import { MapPin, Clock, Star, Home, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

interface LocationCardProps {
  location: {
    id: string;
    name: string;
    address: string;
    type: 'home' | 'work' | 'favorite' | 'recent' | 'popular';
    coordinates: { lat: number; lng: number };
    lastVisited?: Date;
    frequency?: number;
  };
  onSelect: () => void;
  isSelected?: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onSelect,
  isSelected = false
}) => {
  const getIcon = () => {
    switch (location.type) {
      case 'home':
        return <Home className="w-5 h-5 text-taxi-yellow" />;
      case 'work':
        return <Briefcase className="w-5 h-5 text-taxi-yellow" />;
      case 'favorite':
        return <Star className="w-5 h-5 text-taxi-yellow" />;
      case 'recent':
        return <Clock className="w-5 h-5 text-taxi-yellow" />;
      default:
        return <MapPin className="w-5 h-5 text-taxi-yellow" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <GlassCard
        className={`
          p-4 cursor-pointer transition-all duration-200
          ${isSelected ? 'border-taxi-yellow bg-taxi-yellow/10' : 'hover:bg-white/5'}
        `}
        onClick={onSelect}
      >
        <div className="flex items-center space-x-3">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${isSelected ? 'bg-taxi-yellow/30' : 'bg-taxi-yellow/10'}
            transition-colors duration-200
          `}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="text-white font-medium group-hover:text-taxi-yellow transition-colors">
              {location.name}
            </div>
            <div className="text-sm text-gray-400">
              {location.address}
            </div>
            {location.lastVisited && (
              <div className="text-xs text-gray-500 mt-1">
                Last used: {new Date(location.lastVisited).toLocaleDateString()}
              </div>
            )}
            {location.frequency && location.frequency > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Used {location.frequency} time{location.frequency !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-6 h-6 rounded-full bg-taxi-yellow flex items-center justify-center"
            >
              <MapPin className="w-4 h-4 text-night-black" />
            </motion.div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default LocationCard;
