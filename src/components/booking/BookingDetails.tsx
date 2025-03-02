import { useEffect, useState } from 'react';
import { realtimeService } from '../../lib/supabaseRealtime';

interface BookingDetailsProps {
  bookingId: string;
  driverId?: string;
}

export function BookingDetails({ bookingId, driverId }: BookingDetailsProps) {
  const [bookingStatus, setBookingStatus] = useState<string>('');
  const [driverLocation, setDriverLocation] = useState<{lat: number; lng: number} | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // Subscribe to booking updates
    realtimeService.subscribeToBookings(bookingId, {
      onBookingUpdate: (payload) => {
        setBookingStatus(payload.new.status);
      }
    });

    // Subscribe to driver location if available
    if (driverId) {
      realtimeService.subscribeToDriverLocation(driverId, {
        onDriverLocationUpdate: (payload) => {
          setDriverLocation({
            lat: payload.new.latitude,
            lng: payload.new.longitude
          });
        }
      });
    }

    // Subscribe to chat messages
    realtimeService.subscribeToChatMessages(bookingId, {
      onChatMessage: (payload) => {
        setMessages(prev => [...prev, payload.new]);
      }
    });

    // Cleanup subscriptions
    return () => {
      realtimeService.unsubscribeAll();
    };
  }, [bookingId, driverId]);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold">Booking Status</h2>
        <p className="text-gray-600">{bookingStatus}</p>
      </div>

      {driverLocation && (
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold">Driver Location</h2>
          <p className="text-gray-600">
            Lat: {driverLocation.lat}, Lng: {driverLocation.lng}
          </p>
        </div>
      )}

      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold">Messages</h2>
        <div className="space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className="p-2 bg-gray-50 rounded">
              <p className="text-sm">{msg.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 