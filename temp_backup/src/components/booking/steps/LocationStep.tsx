import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Star, Home, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import LocationSearch from '../LocationSearch';
import LocationMap from '../LocationMap';
import type { Booking } from '@/types/booking';
import type { Location } from '@/types/location';

interface LocationStepProps {
  bookingData: Partial<Booking>;
  onUpdate: (data: Partial<Booking>) => void;
  onNext: () => void;
}

const mockSavedLocations: Location[] = [
  {
    id: 'home',
    name: 'Home',
    address: '123 Home Street',
    type: 'home',
    coordinates: { latitude: 40.7128, longitude: -74.0060 }
  },
  {
    id: 'work',
    name: 'Work',
    address: '456 Office Avenue',
    type: 'work',
    coordinates: { latitude: 40.7589, longitude: -73.9851 }
  },
  {
    id: 'gym',
    name: 'Gym',
    address: '789 Fitness Road',
    type: 'favorite',
    coordinates: { latitude: 40.7549, longitude: -73.9840 }
  }
];

const mockRecentLocations: Location[] = [
  {
    id: 'recent1',
    name: 'Central Park',
    address: 'Central Park, New York',
    type: 'recent',
    coordinates: { latitude: 40.7829, longitude: -73.9654 },
    lastVisited: new Date('2024-03-15')
  },
  {
    id: 'recent2',
    name: 'Grand Central',
    address: '89 E 42nd St, New York',
    type: 'recent',
    coordinates: { latitude: 40.7527, longitude: -73.9772 },
    lastVisited: new Date('2024-03-14')
  }
];

const LocationStep: React.FC<LocationStepProps> = ({
  bookingData,
  onUpdate,
  onNext
}) => {
  const [pickupLocation, setPickupLocation] = useState<Location | null>(
    bookingData.pickupLocation || null
  );
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(
    bookingData.dropoffLocation || null
  );
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'saved' | 'recent'>('saved');

  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      onUpdate({
        pickupLocation,
        dropoffLocation
      });
    }
  }, [pickupLocation, dropoffLocation, onUpdate]);

  const handleLocationSelect = (type: 'pickup' | 'dropoff', location: Location) => {
    if (type === 'pickup') {
      setPickupLocation(location);
      setError(null);
    } else {
      setDropoffLocation(location);
      setError(null);
    }
  };

  const handleNext = () => {
    if (!pickupLocation || !dropoffLocation) {
      setError('Please select both pickup and drop-off locations');
      return;
    }
    onNext();
  };

  const LocationCard = ({ location, onSelect }: { location: Location, onSelect: () => void }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="w-full p-4 glass-card hover:border-taxi-yellow/30 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-taxi-yellow/20 flex items-center justify-center">
          {location.type === 'home' && <Home className="w-5 h-5 text-taxi-yellow" />}
          {location.type === 'work' && <Briefcase className="w-5 h-5 text-taxi-yellow" />}
          {location.type === 'favorite' && <Star className="w-5 h-5 text-taxi-yellow" />}
          {location.type === 'recent' && <Clock className="w-5 h-5 text-taxi-yellow" />}
        </div>
        <div className="flex-1 text-left">
          <div className="text-white font-medium">{location.name}</div>
          <div className="text-sm text-gray-400">{location.address}</div>
          {location.lastVisited && (
            <div className="text-xs text-gray-500">
              Last visited: {new Date(location.lastVisited).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left Column - Location Inputs and Saved Places */}
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Where are you going?</h2>
          <p className="text-gray-400">Enter your pickup and drop-off locations</p>
        </div>

        {/* Location Inputs */}
        <div className="space-y-4">
          <div className="relative">
            <LocationSearch
              type="pickup"
              value={pickupLocation?.address || ''}
              onSelect={(location) => handleLocationSelect('pickup', location)}
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
              onSelect={(location) => handleLocationSelect('dropoff', location)}
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

          <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
            {activeTab === 'saved' ? (
              mockSavedLocations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onSelect={() => handleLocationSelect('pickup', location)}
                />
              ))
            ) : (
              mockRecentLocations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onSelect={() => handleLocationSelect('pickup', location)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Map */}
      <div className="space-y-6">
        <div className="h-[500px]">
          <LocationMap
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            className="w-full h-full"
          />
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!pickupLocation || !dropoffLocation}
          className={`
            w-full py-3 px-4 rounded-lg text-center font-medium transition-colors
            ${(!pickupLocation || !dropoffLocation)
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-taxi-yellow text-night-black hover:bg-taxi-yellow/90'
            }
          `}
        >
          Continue to Date & Time
        </button>
      </div>
    </div>
  );
};

export default LocationStep; 