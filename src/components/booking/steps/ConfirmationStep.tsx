import React from 'react';
import type { Booking } from '@/types/booking';

interface ConfirmationStepProps {
  bookingData: Partial<Booking>;
  onUpdate?: (data: Partial<Booking>) => void;
  onComplete: () => void;
  onBack: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  bookingData,
  onComplete,
  onBack
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Confirm Your Booking</h2>
      
      {/* Pickup Location */}
      <div className="bg-zinc-800/50 p-4 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-2">Pickup Location</h3>
        <p className="text-white/80">{bookingData.pickupLocation?.address}</p>
      </div>

      {/* Dropoff Location */}
      <div className="bg-zinc-800/50 p-4 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-2">Dropoff Location</h3>
        <p className="text-white/80">{bookingData.dropoffLocation?.address}</p>
      </div>

      {/* Date & Time */}
      <div className="bg-zinc-800/50 p-4 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-2">Date & Time</h3>
        <p className="text-white/80">
          {bookingData.date ? new Date(bookingData.date).toLocaleDateString() : ''} at {bookingData.time || ''}
        </p>
      </div>

      {/* Vehicle Type */}
      <div className="bg-zinc-800/50 p-4 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-2">Vehicle Type</h3>
        <p className="text-white/80">{bookingData.vehicleType}</p>
      </div>

      {/* Estimated Price */}
      <div className="bg-zinc-800/50 p-4 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-2">Estimated Price</h3>
        <p className="text-2xl font-bold text-taxi-yellow">
          ${(bookingData.estimatedPrice || 0).toFixed(2)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 rounded-xl bg-zinc-800/50 text-white hover:bg-zinc-700/50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onComplete}
          className="flex-1 px-6 py-3 rounded-xl bg-taxi-yellow text-black font-semibold hover:bg-[#FFE17D] transition-colors"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
