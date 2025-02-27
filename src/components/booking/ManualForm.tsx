import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/shared/Input';
import { useBookingStore } from '@/stores/bookingStore';
import { generateUUID } from '@/utils/uuid';
import { estimatePrice } from '@/services/mapService';
import LocationSearch from '@/components/booking/LocationSearch';
import { Location } from '@/types/map';
import { useAuthStore } from '@/stores/authStore';
import { Booking } from '@/types/booking';

const bookingSchema = z.object({
  pickupLocation: z.string().min(1, 'Pickup location is required'),
  dropoffLocation: z.string().min(1, 'Drop-off location is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  passengers: z.string().min(1, 'Number of passengers is required'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const ManualForm: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentBooking } = useBookingStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      passengers: '1',
      notes: '',
    },
  });

  const handleLocationSelect = (type: 'pickup' | 'dropoff', location: Location) => {
    const locationWithName = {
      ...location,
      name: location.address // Use address as name if not provided
    };
    
    if (type === 'pickup') {
      setPickupLocation(locationWithName);
      setValue('pickupLocation', locationWithName.address);
    } else {
      setDropoffLocation(locationWithName);
      setValue('dropoffLocation', locationWithName.address);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!pickupLocation || !dropoffLocation) {
        setError('Please select valid pickup and drop-off locations');
        return;
      }

      // Calculate estimated price based on straight-line distance
      const distance = calculateDistance(
        [pickupLocation.coordinates[0], pickupLocation.coordinates[1]],
        [dropoffLocation.coordinates[0], dropoffLocation.coordinates[1]]
      );
      const price = estimatePrice(distance * 1000); // Convert km to meters

      const booking: Booking = {
        id: generateUUID(),
        userId: user?.id || '',
        pickupLocation: {
          ...pickupLocation,
          name: pickupLocation.address,
          coordinates: {
            lat: pickupLocation.coordinates[1],
            lng: pickupLocation.coordinates[0]
          }
        },
        dropoffLocation: {
          ...dropoffLocation,
          name: dropoffLocation.address,
          coordinates: {
            lat: dropoffLocation.coordinates[1],
            lng: dropoffLocation.coordinates[0]
          }
        },
        route: null,
        date: data.date,
        time: data.time,
        passengers: parseInt(data.passengers),
        notes: data.notes,
        status: 'pending',
        price,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setCurrentBooking(booking);
      navigate('/book/confirm');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your booking');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
    const [lon1, lat1] = point1;
    const [lon2, lat2] = point2;
    const R = 6371; // Earth's radius in km

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <LocationSearch
          type="pickup"
          value=""
          onSelect={handleLocationSelect}
          placeholder="Enter pickup location"
          className="w-full"
        />
        {errors.pickupLocation && (
          <p className="text-red-500 text-sm">{errors.pickupLocation.message}</p>
        )}

        <LocationSearch
          type="dropoff"
          value=""
          onSelect={handleLocationSelect}
          placeholder="Enter drop-off location"
          className="w-full"
        />
        {errors.dropoffLocation && (
          <p className="text-red-500 text-sm">{errors.dropoffLocation.message}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            label="Date"
            error={errors.date?.message}
            {...register('date')}
          />
          <Input
            type="time"
            label="Time"
            error={errors.time?.message}
            {...register('time')}
          />
        </div>

        <Input
          type="number"
          label="Number of Passengers"
          min="1"
          max="4"
          error={errors.passengers?.message}
          {...register('passengers')}
        />

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            rows={3}
            placeholder="Any special instructions for the driver..."
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`
          w-full py-3 px-4 rounded-lg text-white font-medium
          ${isLoading ? 'bg-gray-400' : 'bg-primary hover:bg-primary/90'}
          transition-colors
        `}
      >
        {isLoading ? 'Processing...' : 'Book Now'}
      </button>
    </form>
  );
};

export default ManualForm; 