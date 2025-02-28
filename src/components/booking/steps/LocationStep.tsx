import React, { useState, useEffect } from 'react';
import { useLocationStore } from '@/stores/locationStore';
import { useAuthStore } from '@/stores/authStore';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import LocationSearch from '../LocationSearch';
import LocationMap from '../LocationMap';
import LocationCard from '../LocationCard';
import type { Booking } from '@/types/booking';
import type { Location } from '@/types/location';

interface LocationStepProps {
  formData: Partial<Booking>;
  onChange: (data: Partial<Booking>) => void;
  bookingData?: Partial<Booking>;
  onUpdate?: (data: Partial<Booking>) => void;
  onNext?: () => void;
}

const LocationStep: React.FC<LocationStepProps> = ({
  formData,
  onChange
}) => {
  const { user } = useAuthStore();
  const { 
    addLocation, 
    fetchFrequentLocations, 
    fetchPopularLocations, 
    isLoading, 
    error: locationError,
    frequentLocations,
    popularLocations
  } = useLocationStore();

  const [pickupLocation, setPickupLocation] = useState<Location | null>(
    formData.pickupLocation || null
  );
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(
    formData.dropoffLocation || null
  );
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'saved' | 'recent'>('saved');

  // Fetch locations when component mounts
  useEffect(() => {
    if (user?.id) {
      fetchFrequentLocations(user.id);
      fetchPopularLocations();
    }
  }, [user?.id, fetchFrequentLocations, fetchPopularLocations]);

  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      onChange({
        pickupLocation,
        dropoffLocation
      });
    }
  }, [pickupLocation, dropoffLocation, onChange]);

  const handleLocationSelect = async (type: 'pickup' | 'dropoff', location: any) => {
    try {
      // Add to user's locations if authenticated
      if (user?.id) {
        await addLocation(user.id, {
          address: location.address,
          latitude: location.coordinates.lat,
          longitude: location.coordinates.lng,
          type
        });
      }
      
      const locationObj = {
        name: location.address,
        address: location.address,
        coordinates: { lat: location.coordinates.lat, lng: location.coordinates.lng }
      };
      
      if (type === 'pickup') {
        const toast = (await import('react-hot-toast')).default;
        toast.success('Pickup location set');
        setPickupLocation(locationObj);
        onChange({ pickupLocation: locationObj });
        setError(null);
      } else {
        const toast = (await import('react-hot-toast')).default;
        toast.success('Drop-off location set');
        setDropoffLocation(locationObj);
        onChange({ dropoffLocation: locationObj });
        setError(null);
      }
    } catch (error) {
      console.error('Error selecting location:', error);
      const toast = (await import('react-hot-toast')).default;
      toast.error('Failed to set location');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left Column - Location Inputs and Saved Places */}
      <div className="space-y-6">
        <div className="text-left mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Where are you going?</h2>
          <p className="text-gray-400">Enter your pickup and drop-off locations</p>
        </div>

        {/* Location Inputs */}
        <div className="space-y-4">
          <div className="relative">
            <LocationSearch
              type="pickup"
              value={pickupLocation?.address || ''}
              onSelect={(location) => handleLocationSelect('pickup', { 
                address: location.address,
                coordinates: { lat: location.coordinates[1], lng: location.coordinates[0] }
              })}
              placeholder="Enter pickup location"
              className="w-full glass-input pl-14"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <div className="w-8 h-8 rounded-full bg-taxi-yellow/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-taxi-yellow" />
              </div>
            </div>
          </div>

          <div className="relative">
            <LocationSearch
              type="dropoff"
              value={dropoffLocation?.address || ''}
              onSelect={(location) => handleLocationSelect('dropoff', { 
                address: location.address,
                coordinates: { lat: location.coordinates[1], lng: location.coordinates[0] }
              })}
              placeholder="Enter drop-off location"
              className="w-full glass-input pl-14"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-success" />
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-error text-sm"
            >
              {error}
            </motion.div>
          )}
        </div>

        {/* Saved/Recent Locations Tabs */}
        <div className="space-y-4">
          <div className="flex space-x-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-2 px-4 text-sm font-medium transition-colors relative
                ${activeTab === 'saved' ? 'text-taxi-yellow' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Saved Places
              {activeTab === 'saved' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-taxi-yellow"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`pb-2 px-4 text-sm font-medium transition-colors relative
                ${activeTab === 'recent' ? 'text-taxi-yellow' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Recent Places
              {activeTab === 'recent' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-taxi-yellow"
                />
              )}
            </button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar relative min-h-[200px]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-night-black/50 backdrop-blur-sm">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 border-2 border-taxi-yellow border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-taxi-yellow">Loading locations...</p>
                </div>
              </div>
            )}
            
            {locationError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-error/10 border border-error/20 rounded-lg p-4 text-sm text-error"
              >
                {locationError}
              </motion.div>
            )}

            {!isLoading && !locationError && activeTab === 'saved' && frequentLocations.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-400"
              >
                <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                <p>No saved locations yet</p>
                <p className="text-sm">Your frequent destinations will appear here</p>
              </motion.div>
            )}
            
            {activeTab === 'saved' ? (
              // Frequent locations
              frequentLocations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={{
                    id: location.id,
                    name: location.address.split(',')[0],
                    address: location.address,
                    type: 'recent',
                    coordinates: { lat: location.latitude, lng: location.longitude }
                  }}
                  onSelect={() => handleLocationSelect('pickup', {
                    address: location.address,
                    coordinates: { lat: location.latitude, lng: location.longitude }
                  })}
                />
              ))
            ) : (
              // Popular locations
              popularLocations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={{
                    id: location.id,
                    name: location.address.split(',')[0],
                    address: location.address,
                    type: 'popular',
                    coordinates: { lat: location.latitude, lng: location.longitude }
                  }}
                  onSelect={() => handleLocationSelect('pickup', {
                    address: location.address,
                    coordinates: { lat: location.latitude, lng: location.longitude }
                  })}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Map */}
      <div className="space-y-6">
        <div className="h-[400px] lg:h-[500px] sticky top-0">
          <LocationMap
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            className="w-full h-full"
          />
        </div>

        {/* Error message if locations not selected */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-error/10 border border-error/20 rounded-lg p-3 text-sm text-error"
          >
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LocationStep;