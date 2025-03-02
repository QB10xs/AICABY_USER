import React from 'react';
import { MapPin, Clock, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { useLocationStore } from '@/stores/locationStore';
import { useAuthStore } from '@/stores/authStore';

interface LocationSuggestionsProps {
  onLocationSelect: (address: string) => void;
  type: 'pickup' | 'dropoff';
}

const LocationSuggestions: React.FC<LocationSuggestionsProps> = ({
  onLocationSelect,
  type
}) => {
  const { user } = useAuthStore();
  const { 
    frequentLocations,
    popularLocations,
    fetchFrequentLocations,
    fetchPopularLocations,
    isLoading
  } = useLocationStore();

  React.useEffect(() => {
    if (user?.id) {
      fetchFrequentLocations(user.id);
      fetchPopularLocations();
    }
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-6 h-6 border-2 border-taxi-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderLocationList = (locations: any[], title: string, icon: React.ReactNode) => {
    if (!locations.length) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
          {icon}
          <span>{title}</span>
        </div>
        <div className="space-y-2">
          {locations.map((location) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <GlassCard
                className="p-3 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => onLocationSelect(location.address)}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-taxi-yellow" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{location.address}</p>
                    {location.frequency > 0 && (
                      <p className="text-xs text-[#9CA3AF]">
                        Used {location.frequency} time{location.frequency !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const filteredFrequent = frequentLocations.filter(loc => loc.type === type);
  const filteredPopular = popularLocations.filter(loc => loc.type === type);

  if (!filteredFrequent.length && !filteredPopular.length) {
    return null;
  }

  return (
    <div className="space-y-4 mt-2">
      {renderLocationList(filteredFrequent, 'Recent Locations', <Clock className="w-4 h-4" />)}
      {renderLocationList(filteredPopular, 'Popular Nearby', <Navigation className="w-4 h-4" />)}
    </div>
  );
};

export default LocationSuggestions;
