import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Booking } from '@/types/booking';
import type { Location } from '@/types/location';

interface CreateBookingParams {
  pickupLocation: Location;
  dropoffLocation: Location;
  pickupTime: Date;
  vehicleType: string;
  distance: number;
  duration: number;
  price: number;
  paymentMethod: string;
  notes?: string;
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Set up real-time subscription
  useRealtimeSubscription('bookings', (payload) => {
    if (payload.eventType === 'INSERT') {
      setBookings(prev => [payload.new as Booking, ...prev]);
    } else if (payload.eventType === 'UPDATE') {
      setBookings(prev => prev.map(booking => 
        booking.id === payload.new.id ? payload.new as Booking : booking
      ));
    } else if (payload.eventType === 'DELETE') {
      setBookings(prev => prev.filter(booking => booking.id !== payload.old.id));
    }
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          pickup_location:locations!pickup_location_id(*),
          dropoff_location:locations!dropoff_location_id(*),
          driver:drivers(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (params: CreateBookingParams) => {
    try {
      setLoading(true);
      
      // First, store the locations
      const { data: pickupLoc, error: pickupError } = await supabase
        .from('locations')
        .insert({
          address: params.pickupLocation.address,
          coordinates: `(${params.pickupLocation.coordinates.lat},${params.pickupLocation.coordinates.lng})`,
          name: params.pickupLocation.name
        })
        .select()
        .single();

      if (pickupError) throw pickupError;

      const { data: dropoffLoc, error: dropoffError } = await supabase
        .from('locations')
        .insert({
          address: params.dropoffLocation.address,
          coordinates: `(${params.dropoffLocation.coordinates.lat},${params.dropoffLocation.coordinates.lng})`,
          name: params.dropoffLocation.name
        })
        .select()
        .single();

      if (dropoffError) throw dropoffError;

      // Then create the booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          pickup_location_id: pickupLoc.id,
          dropoff_location_id: dropoffLoc.id,
          pickup_time: params.pickupTime.toISOString(),
          vehicle_type: params.vehicleType,
          distance: params.distance,
          duration: params.duration,
          price: params.price,
          payment_method: params.paymentMethod,
          notes: params.notes
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Refresh bookings list
      await fetchBookings();
      return booking;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      await fetchBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    cancelBooking,
    refreshBookings: fetchBookings
  };
}
