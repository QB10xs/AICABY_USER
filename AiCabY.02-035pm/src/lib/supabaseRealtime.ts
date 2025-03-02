import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface SubscriptionCallbacks {
  onBookingUpdate?: (payload: any) => void;
  onDriverLocationUpdate?: (payload: any) => void;
  onChatMessage?: (payload: any) => void;
}

class RealtimeService {
  private bookingChannel?: RealtimeChannel;
  private driverChannel?: RealtimeChannel;
  private chatChannel?: RealtimeChannel;

  constructor() {
    // Initialize Supabase realtime client
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.realtime.setAuth(session.access_token);
      }
    });
  }

  subscribeToBookings(bookingId: string, callbacks: SubscriptionCallbacks) {
    this.bookingChannel = supabase
      .channel(`booking:${bookingId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `id=eq.${bookingId}`,
      }, (payload) => {
        callbacks.onBookingUpdate?.(payload);
      })
      .subscribe();
  }

  subscribeToDriverLocation(driverId: string, callbacks: SubscriptionCallbacks) {
    this.driverChannel = supabase
      .channel(`driver:${driverId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'driver_locations',
        filter: `driver_id=eq.${driverId}`,
      }, (payload) => {
        callbacks.onDriverLocationUpdate?.(payload);
      })
      .subscribe();
  }

  subscribeToChatMessages(bookingId: string, callbacks: SubscriptionCallbacks) {
    this.chatChannel = supabase
      .channel(`chat:${bookingId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `booking_id=eq.${bookingId}`,
      }, (payload) => {
        callbacks.onChatMessage?.(payload);
      })
      .subscribe();
  }

  unsubscribeAll() {
    this.bookingChannel?.unsubscribe();
    this.driverChannel?.unsubscribe();
    this.chatChannel?.unsubscribe();
  }
}

export const realtimeService = new RealtimeService(); 