import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { RealtimePayload } from '@/types/supabase';

interface Driver {
  id: string;
  vehicleType: string;
  licenseNumber: string;
  vehiclePlate: string;
  rating: number;
  totalRides: number;
  isActive: boolean;
}

interface Review {
  id: string;
  bookingId: string;
  driverId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Set up real-time subscription for drivers
  useRealtimeSubscription('drivers', (payload: RealtimePayload) => {
    if (payload.eventType === 'INSERT') {
      setDrivers(prev => [payload.new as Driver, ...prev]);
    } else if (payload.eventType === 'UPDATE') {
      setDrivers(prev => prev.map(driver => 
        driver.id === payload.new.id ? payload.new as Driver : driver
      ));
    } else if (payload.eventType === 'DELETE') {
      setDrivers(prev => prev.filter(driver => driver.id !== payload.old.id));
    }
  });

  // Set up real-time subscription for driver reviews
  useRealtimeSubscription('driver_reviews', (payload: RealtimePayload) => {
    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
      // Refresh drivers to get updated ratings
      fetchDrivers();
    }
  });

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setDrivers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getDriverReviews = async (driverId: string) => {
    try {
      const { data, error } = await supabase
        .from('driver_reviews')
        .select(`
          *,
          user:profiles(first_name),
          booking:bookings(pickup_location_id, dropoff_location_id)
        `)
        .eq('driver_id', driverId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const submitReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('driver_reviews')
        .insert(review)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    drivers,
    loading,
    error,
    getDriverReviews,
    submitReview,
    refreshDrivers: fetchDrivers
  };
}
