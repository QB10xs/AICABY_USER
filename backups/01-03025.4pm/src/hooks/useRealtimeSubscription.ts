import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

type RealtimePayload = {
  new: Record<string, any>;
  old: Record<string, any>;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
};

export function useRealtimeSubscription(
  table: string,
  callback: (payload: RealtimePayload) => void
) {
  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      channel = supabase
        .channel(`public:${table}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table
          },
          (payload) => {
            callback(payload as unknown as RealtimePayload);
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, callback]);
}
