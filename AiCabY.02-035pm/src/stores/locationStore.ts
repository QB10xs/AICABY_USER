import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface Location {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  frequency: number;
  lastUsed: Date;
  type: 'pickup' | 'dropoff';
}

interface LocationState {
  frequentLocations: Location[];
  popularLocations: Location[];
  isLoading: boolean;
  error: string | null;
  fetchFrequentLocations: (userId: string) => Promise<void>;
  fetchPopularLocations: () => Promise<void>;
  addLocation: (userId: string, location: Omit<Location, 'id' | 'frequency' | 'lastUsed'>) => Promise<void>;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  frequentLocations: [],
  popularLocations: [],
  isLoading: false,
  error: null,

  fetchFrequentLocations: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', userId)
        .order('frequency', { ascending: false })
        .order('last_used', { ascending: false })
        .limit(5);

      if (error) throw error;

      set({ 
        frequentLocations: data.map(loc => ({
          id: loc.id,
          address: loc.address,
          latitude: loc.latitude,
          longitude: loc.longitude,
          frequency: loc.frequency,
          lastUsed: new Date(loc.last_used),
          type: loc.type
        }))
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPopularLocations: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('popular_locations')
        .select('*')
        .order('total_rides', { ascending: false })
        .limit(5);

      if (error) throw error;

      set({ 
        popularLocations: data.map(loc => ({
          id: loc.id,
          address: loc.address,
          latitude: loc.latitude,
          longitude: loc.longitude,
          frequency: loc.total_rides,
          lastUsed: new Date(),
          type: 'pickup'
        }))
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addLocation: async (userId: string, location) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: existingLocation } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', userId)
        .eq('address', location.address)
        .single();

      if (existingLocation) {
        // Update frequency and last_used
        await supabase
          .from('user_locations')
          .update({
            frequency: existingLocation.frequency + 1,
            last_used: new Date().toISOString()
          })
          .eq('id', existingLocation.id);
      } else {
        // Insert new location
        await supabase
          .from('user_locations')
          .insert({
            user_id: userId,
            address: location.address,
            latitude: location.latitude,
            longitude: location.longitude,
            frequency: 1,
            last_used: new Date().toISOString(),
            type: location.type
          });
      }

      // Refresh frequent locations
      await get().fetchFrequentLocations(userId);
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  }
}));
