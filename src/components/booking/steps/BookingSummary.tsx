import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Car, CreditCard, Banknote, Wallet } from 'lucide-react';
import type { VehicleCategory } from './VehicleSelectionStep';
import { formatCurrency } from '@/utils/format';

import type { Location } from '@/types/location';

export interface PaymentMethod {
  id: 'cash' | 'token' | 'pos';
  name: string;
  icon: React.ReactNode;
  description: string;
  availableForScheduled: boolean;
}

interface BookingSummaryProps {
  pickup: Location;
  dropoff: Location;
  distance: number;
  duration: number;
  selectedVehicle: VehicleCategory;
  isScheduled?: boolean;
  onPaymentMethodSelect: (method: PaymentMethod['id']) => void;
  selectedPaymentMethod?: PaymentMethod['id'];
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'cash',
    name: 'Cash',
    icon: <Banknote className="w-5 h-5" />,
    description: 'Pay with cash after your ride',
    availableForScheduled: false
  },
  {
    id: 'token',
    name: 'Token',
    icon: <Wallet className="w-5 h-5" />,
    description: 'Pay with AICABY tokens',
    availableForScheduled: true
  },
  {
    id: 'pos',
    name: 'Card (POS)',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Pay by card after your ride',
    availableForScheduled: false
  }
];

const BookingSummary: React.FC<BookingSummaryProps> = ({
  pickup,
  dropoff,
  distance,
  duration,
  selectedVehicle,
  isScheduled = false,
  onPaymentMethodSelect,
  selectedPaymentMethod
}) => {
  const totalPrice = selectedVehicle.basePrice + (distance * selectedVehicle.pricePerKm);

  return (
    <div className="space-y-6">
      {/* Trip Details */}
      <div className="rounded-xl bg-[rgba(42,42,42,0.7)] border border-[#F7C948]/20 backdrop-blur-lg p-6">
        <h3 className="text-lg font-medium text-[#F7C948] mb-4">Trip Summary</h3>
        
        {/* Locations */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#F7C948]/20 flex items-center justify-center mt-1">
              <MapPin className="w-4 h-4 text-[#F7C948]" />
            </div>
            <div>
              <span className="text-sm text-zinc-400">Pickup</span>
              <p className="text-white">{pickup.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#F7C948]/20 flex items-center justify-center mt-1">
              <MapPin className="w-4 h-4 text-[#F7C948]" />
            </div>
            <div>
              <span className="text-sm text-zinc-400">Dropoff</span>
              <p className="text-white">{dropoff.address}</p>
            </div>
          </div>
        </div>

        {/* Trip Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 rounded-lg bg-white/5">
            <Clock className="w-5 h-5 text-[#F7C948] mx-auto mb-1" />
            <span className="text-sm text-zinc-400">Duration</span>
            <p className="text-white font-medium">{Math.round(duration)} min</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <Car className="w-5 h-5 text-[#F7C948] mx-auto mb-1" />
            <span className="text-sm text-zinc-400">Distance</span>
            <p className="text-white font-medium">{distance} km</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <CreditCard className="w-5 h-5 text-[#F7C948] mx-auto mb-1" />
            <span className="text-sm text-zinc-400">Total</span>
            <p className="text-white font-medium">{formatCurrency(totalPrice)}</p>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="rounded-xl bg-[rgba(42,42,42,0.7)] border border-[#F7C948]/20 backdrop-blur-lg p-6">
        <h3 className="text-lg font-medium text-[#F7C948] mb-4">Payment Method</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {paymentMethods
            .filter(method => !isScheduled || method.availableForScheduled)
            .map((method) => {
              const isSelected = selectedPaymentMethod === method.id;
              
              return (
                <motion.button
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onPaymentMethodSelect(method.id)}
                  className={`
                    relative p-4 rounded-lg text-left transition-all duration-200
                    ${isSelected 
                      ? 'bg-[#F7C948]/20 border-[#F7C948]' 
                      : 'bg-white/5 border-transparent hover:bg-white/10'
                    }
                    border
                  `}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-[#F7C948]">
                      {method.icon}
                    </div>
                    <span className="font-medium">{method.name}</span>
                  </div>
                  <p className="text-sm text-zinc-400">{method.description}</p>
                </motion.button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
