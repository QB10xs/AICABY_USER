import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Location } from '@/types/location';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [frequentLocations, setFrequentLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  // Set up real-time subscription
  useRealtimeSubscription('locations', (payload) => {
    if (payload.eventType === 'INSERT') {
      setLocations(prev => [payload.new as Location, ...prev]);
      updateFrequentLocations([payload.new as Location, ...locations]);
    } else if (payload.eventType === 'UPDATE') {
      setLocations(prev => prev.map(location => 
        location.id === payload.new.id ? payload.new as Location : location
      ));
      updateFrequentLocations(locations.map(location => 
        location.id === payload.new.id ? payload.new as Location : location
      ));
    } else if (payload.eventType === 'DELETE') {
      setLocations(prev => prev.filter(location => location.id !== payload.old.id));
      updateFrequentLocations(locations.filter(location => location.id !== payload.old.id));
    }
  });

  const updateFrequentLocations = (updatedLocations: Location[]) => {
    const frequent = updatedLocations
      .filter(loc => loc.frequency > 1)
      .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
      .slice(0, 5);
    setFrequentLocations(frequent);
  };

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('last_visited', { ascending: false });

      if (error) throw error;
      setLocations(data || []);

      // Get frequent locations (visited more than once)
      const frequent = (data || []).filter(loc => loc.frequency > 1)
        .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
        .slice(0, 5);
      setFrequentLocations(frequent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const saveLocation = async (location: Omit<Location, 'id'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('locations')
        .insert({
          name: location.name,
          address: location.address,
          coordinates: `(${location.coordinates.lat},${location.coordinates.lng})`,
          type: location.type
        })
        .select()
        .single();

      if (error) throw error;
      await fetchLocations();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLocationFrequency = async (locationId: string) => {
    try {
      const { error } = await supabase
        .from('locations')
        .update({
          frequency: supabase.raw('frequency + 1'),
          last_visited: new Date().toISOString()
        })
        .eq('id', locationId);

      if (error) throw error;
      await fetchLocations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return {
    locations,
    frequentLocations,
    loading,
    error,
    saveLocation,
    updateLocationFrequency,
    refreshLocations: fetchLocations
  };
}
