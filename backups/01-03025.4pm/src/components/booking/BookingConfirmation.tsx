import React from 'react';
import { format } from 'date-fns';
import { Booking } from '@/stores/bookingStore';

interface BookingConfirmationProps {
  booking: Booking;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onConfirm,
  onCancel,
  isProcessing = false,
}) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDistance = (meters: number): string => {
    const km = (meters / 1000).toFixed(1);
    return `${km} km`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-accent mb-6">Booking Confirmation</h2>
      
      {/* Ride Details */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Locations */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Pickup Location</label>
              <p className="text-gray-900">{booking.pickupLocation.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Destination</label>
              <p className="text-gray-900">{booking.dropoffLocation.address}</p>
            </div>
          </div>

          {/* Time and Passengers */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Date & Time</label>
              <p className="text-gray-900">
                {format(new Date(`${booking.date} ${booking.time}`), 'PPP p')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Passengers</label>
              <p className="text-gray-900">{booking.passengers} passenger(s)</p>
            </div>
          </div>
        </div>

        {/* Route Details */}
        {booking.route && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Distance</label>
                <p className="text-gray-900">{formatDistance(booking.route.distance)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Duration</label>
                <p className="text-gray-900">{formatDuration(booking.route.duration)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Estimated Price</label>
                <p className="text-gray-900 font-semibold">€{booking.price}</p>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div>
            <label className="text-sm font-medium text-gray-500">Additional Notes</label>
            <p className="text-gray-900 mt-1">{booking.notes}</p>
          </div>
        )}

        {/* Service Fee Notice */}
        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text-sm text-accent">
            <span className="font-medium">Service Fee:</span> €1.50 - This will be added to your fare and paid directly to the driver.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end mt-6">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`
              px-6 py-2 rounded-lg text-white font-medium transition-colors
              ${isProcessing
                ? 'bg-primary/50 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90'
              }
            `}
          >
            {isProcessing ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 