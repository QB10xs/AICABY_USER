import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/stores/bookingStore';
import { useAuthStore } from '@/stores/authStore';
import { Location } from '@/types/map';
import LocationSearch from './LocationSearch';
import BookingConfirmation from './BookingConfirmation';
import { generateUUID } from '@/utils/uuid';
import { estimatePrice } from '@/services/mapService';

const ManualBooking: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { setCurrentBooking, addToHistory } = useBookingStore();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [locations, setLocations] = useState<{
    pickup: Location | null;
    dropoff: Location | null;
  }>({
    pickup: null,
    dropoff: null,
  });

  const handlePickupSelect = (location: Location) => {
    setLocations(prev => ({
      ...prev,
      pickup: location
    }));
  };

  const handleDropoffSelect = (location: Location) => {
    setLocations(prev => ({
      ...prev,
      dropoff: location
    }));
  };



  const handleConfirmBooking = async () => {
    if (!user || !locations.pickup || !locations.dropoff) return;

    setIsProcessing(true);
    try {
      // Create a new booking
      const booking = {
        id: generateUUID(),
        userId: user.id,
        pickupLocation: {
          name: locations.pickup.address,
          address: locations.pickup.address,
          coordinates: {
            lat: locations.pickup.coordinates[0],
            lng: locations.pickup.coordinates[1]
          }
        },
        dropoffLocation: {
          name: locations.dropoff.address,
          address: locations.dropoff.address,
          coordinates: {
            lat: locations.dropoff.coordinates[0],
            lng: locations.dropoff.coordinates[1]
          }
        },
        route: null,
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        passengers: 1,
        status: 'confirmed' as const,
        price: estimatePrice(15000), // Default 15km for now, will update with actual route later
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setCurrentBooking(booking);
      addToHistory(booking);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error confirming booking:', error);
    } finally {
      setIsProcessing(false);
      setShowConfirmation(false);
    }
  };

  const handleCancelBooking = () => {
    setShowConfirmation(false);
    setLocations({
      pickup: null,
      dropoff: null,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Book a Ride</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Location
            </label>
            <LocationSearch
              type="pickup"
              value={locations.pickup?.address || ''}
              onSelect={handlePickupSelect}
              placeholder="Enter pickup location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dropoff Location
            </label>
            <LocationSearch
              type="dropoff"
              value={locations.dropoff?.address || ''}
              onSelect={handleDropoffSelect}
              placeholder="Enter dropoff location"
            />
          </div>

          <button
            onClick={() => setShowConfirmation(true)}
            disabled={!locations.pickup || !locations.dropoff}
            className={`
              w-full py-3 px-4 rounded-lg text-white font-medium
              ${(!locations.pickup || !locations.dropoff)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90'
              }
            `}
          >
            Continue to Booking
          </button>
        </div>
      </div>

      {showConfirmation && locations.pickup && locations.dropoff && (
        <BookingConfirmation
          booking={{
            id: generateUUID(),
            userId: user?.id || '',
            pickupLocation: {
              name: locations.pickup.address,
              address: locations.pickup.address,
              coordinates: {
                lat: locations.pickup.coordinates[0],
                lng: locations.pickup.coordinates[1]
              }
            },
            dropoffLocation: {
              name: locations.dropoff.address,
              address: locations.dropoff.address,
              coordinates: {
                lat: locations.dropoff.coordinates[0],
                lng: locations.dropoff.coordinates[1]
              }
            },
            route: null,
            date: new Date().toISOString(),
            time: new Date().toLocaleTimeString(),
            passengers: 1,
            status: 'pending',
            price: estimatePrice(15000), // Default 15km for now
            createdAt: new Date(),
            updatedAt: new Date(),
          }}
          onConfirm={handleConfirmBooking}
          onCancel={handleCancelBooking}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

export default ManualBooking; 