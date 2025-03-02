import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBookingStore } from '@/stores/bookingStore';
import { estimatePrice } from '@/utils/pricing';
import { calculateDistance } from '@/utils/distance';
import LocationSearch from '@/components/booking/LocationSearch';
import { Location } from '@/types/map';
import { Booking } from '@/types/booking';
import { Input } from '@/components/ui/input';
import { generateUUID } from '@/utils/uuid';
import { useUserStore } from '@/stores/userStore';

const locationSchema = z.object({
  name: z.string(),
  address: z.string(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  })
});

const bookingSchema = z.object({
  pickupLocation: locationSchema,
  dropoffLocation: locationSchema,
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  passengers: z.string().min(1, 'Number of passengers is required'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const ManualForm: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentBooking } = useBookingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useUserStore(state => state.user);

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

  const convertMapLocationToBookingLocation = (location: Location): z.infer<typeof locationSchema> => ({
    name: location.address,
    address: location.address,
    coordinates: {
      lat: location.coordinates[1],
      lng: location.coordinates[0]
    }
  });

  const handlePickupSelect = (location: Location) => {
    setValue('pickupLocation', convertMapLocationToBookingLocation(location));
  };

  const handleDropoffSelect = (location: Location) => {
    setValue('dropoffLocation', convertMapLocationToBookingLocation(location));
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const { pickupLocation, dropoffLocation } = data;

      if (!pickupLocation || !dropoffLocation) {
        setError('Please select valid pickup and drop-off locations');
        return;
      }

      // Calculate estimated price based on straight-line distance
      const distance = calculateDistance(
        [pickupLocation.coordinates.lng, pickupLocation.coordinates.lat],
        [dropoffLocation.coordinates.lng, dropoffLocation.coordinates.lat]
      );
      const estimatedPrice = estimatePrice(distance * 1000); // Convert km to meters

      const booking: Booking = {
        id: generateUUID(),
        userId: user?.id || '',
        pickupLocation: {
          address: pickupLocation.address,
          coordinates: pickupLocation.coordinates
        },
        dropoffLocation: {
          address: dropoffLocation.address,
          coordinates: dropoffLocation.coordinates
        },
        route: {
          distance: distance * 1000, // Convert km to meters
          duration: 0,
          polyline: ''
        },
        status: 'pending' as const,
        date: data.date,
        time: data.time,
        passengers: Number(data.passengers),
        notes: data.notes || '',
        price: estimatedPrice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setCurrentBooking(booking);
      navigate('/book/confirm');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <LocationSearch
          type="pickup"
          value=""
          label="Pickup Location"
          onSelect={handlePickupSelect}
          error={errors.pickupLocation?.message}
        />
        <LocationSearch
          type="dropoff"
          value=""
          label="Drop-off Location"
          onSelect={handleDropoffSelect}
          error={errors.dropoffLocation?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="date"
              {...register('date')}
              min={new Date().toISOString().split('T')[0]}
              error={errors.date?.message}
            />
          </div>
          <div>
            <Input
              type="time"
              {...register('time')}
              error={errors.time?.message}
            />
          </div>
        </div>
        <div>
          <Input
            type="number"
            {...register('passengers')}
            min="1"
            max="8"
            placeholder="Number of passengers"
            error={errors.passengers?.message}
          />
        </div>
        <div>
          <Input
            type="text"
            {...register('notes')}
            placeholder="Additional notes (optional)"
            error={errors.notes?.message}
          />
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Continue'}
      </button>
    </form>
  );
};

export default ManualForm; 