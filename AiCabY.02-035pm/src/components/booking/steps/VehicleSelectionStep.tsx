import React from 'react';
import { motion } from 'framer-motion';
import { Users, Gauge, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

export interface VehicleCategory {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  pricePerKm: number;
  image: string;
  features: string[];
  capacity: number;
}

interface VehicleSelectionStepProps {
  distance: number; // in km
  onSelect: (category: VehicleCategory) => void;
  selectedCategory?: string;
}

const vehicleCategories: VehicleCategory[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Comfortable and economical',
    basePrice: 30,
    pricePerKm: 1.5,
    image: '/vehicles/standard.png',
    features: ['4 Passengers', 'AC', '4 Luggage'],
    capacity: 4
  },
  {
    id: 'comfort',
    name: 'Comfort',
    description: 'Extra space and comfort',
    basePrice: 45,
    pricePerKm: 2,
    image: '/vehicles/comfort.png',
    features: ['6 Passengers', 'AC', 'Extra Legroom', '6 Luggage'],
    capacity: 6
  },
  {
    id: 'lux',
    name: 'Luxury',
    description: 'Premium experience',
    basePrice: 80,
    pricePerKm: 3,
    image: '/vehicles/luxury.png',
    features: ['4 Passengers', 'Premium Interior', 'Professional Driver', 'Refreshments'],
    capacity: 4
  },
  {
    id: 'bus',
    name: 'Taxi Bus',
    description: 'Perfect for groups',
    basePrice: 100,
    pricePerKm: 4,
    image: '/vehicles/bus.png',
    features: ['8+ Passengers', 'Large Luggage Space', 'AC', 'USB Charging'],
    capacity: 8
  }
];

const VehicleSelectionStep: React.FC<VehicleSelectionStepProps> = ({
  distance,
  onSelect,
  selectedCategory
}) => {
  const calculatePrice = (basePrice: number, pricePerKm: number) => {
    return basePrice + (distance * pricePerKm);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vehicleCategories.map((category) => {
          const totalPrice = calculatePrice(category.basePrice, category.pricePerKm);
          const isSelected = selectedCategory === category.id;

          return (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(category)}
              className={`
                relative overflow-hidden rounded-xl p-4 cursor-pointer
                transition-all duration-200
                ${isSelected 
                  ? 'bg-[#F7C948]/20 border-[#F7C948] shadow-[0_0_20px_rgba(247,201,72,0.2)]' 
                  : 'bg-[rgba(42,42,42,0.7)] border-[#F7C948]/20 hover:bg-[rgba(42,42,42,0.9)]'
                }
                border backdrop-blur-lg
              `}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#F7C948] flex items-center justify-center"
                >
                  <ShieldCheck className="w-4 h-4 text-[#2A2A2A]" />
                </motion.div>
              )}

              {/* Vehicle Image */}
              <div className="relative h-32 mb-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>

              {/* Vehicle Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">{category.name}</h3>
                <p className="text-sm text-zinc-400">{category.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 text-xs">
                    <Users className="w-3 h-3" />
                    <span>{category.capacity} seats</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 text-xs">
                    <Gauge className="w-3 h-3" />
                    <span>{category.pricePerKm}€/km</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-[#F7C948]">
                    {formatCurrency(totalPrice)}
                  </span>
                  <span className="text-sm text-zinc-400">
                    {distance}km
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleSelectionStep;
