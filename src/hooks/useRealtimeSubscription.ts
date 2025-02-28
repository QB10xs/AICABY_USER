import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type TableName = 'bookings' | 'locations' | 'drivers' | 'driver_reviews';
type Event = 'INSERT' | 'UPDATE' | 'DELETE';

interface SubscriptionOptions {
  event?: Event;
  filter?: string;
  schema?: string;
}

export function useRealtimeSubscription(
  tableName: TableName,
  callback: (payload: RealtimePostgresChangesPayload<any>) => void,
  options: SubscriptionOptions = {}
) {
  useEffect(() => {
    let subscription: RealtimeChannel;

    const setupSubscription = async () => {
      // Build the subscription channel
      let channel = supabase
        .channel(`public:${tableName}`)
        .on(
          'postgres_changes',
          {
            event: options.event || '*',
            schema: options.schema || 'public',
            table: tableName,
            ...(options.filter ? { filter: options.filter } : {})
          },
          callback
        );

      // Subscribe to the channel
      subscription = channel.subscribe();
    };

    setupSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [tableName, options.event, options.filter, options.schema]);
}
