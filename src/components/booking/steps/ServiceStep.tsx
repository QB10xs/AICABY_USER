import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Users, Briefcase, Shield, Star, Clock } from 'lucide-react';
import type { Booking } from '@/types/booking';

interface ServiceStepProps {
  bookingData: Partial<Booking>;
  onUpdate: (data: Partial<Booking>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface VehicleType {
  id: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  icon: React.ReactNode;
  features: string[];
}

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
}

const vehicleTypes: VehicleType[] = [
  {
    id: 'economy',
    name: 'Economy',
    description: 'Affordable and efficient rides for everyday travel',
    capacity: 4,
    price: 15,
    icon: <Car className="w-6 h-6" />,
    features: ['Air conditioning', 'Phone charger', '4 seats']
  },
  {
    id: 'comfort',
    name: 'Comfort',
    description: 'Spacious vehicles with extra amenities',
    capacity: 4,
    price: 25,
    icon: <Star className="w-6 h-6" />,
    features: ['Premium interior', 'Extra legroom', 'Water bottles', 'Phone charger']
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Luxury vehicles for professional travel',
    capacity: 4,
    price: 35,
    icon: <Briefcase className="w-6 h-6" />,
    features: ['Premium vehicle', 'Professional driver', 'Leather seats', 'Privacy divider']
  },
  {
    id: 'van',
    name: 'Van',
    description: 'Perfect for groups and luggage',
    capacity: 6,
    price: 40,
    icon: <Users className="w-6 h-6" />,
    features: ['6+ seats', 'Extra luggage space', 'Air conditioning', 'Phone charger']
  }
];

const serviceOptions: ServiceOption[] = [
  {
    id: 'priority',
    name: 'Priority Pickup',
    description: 'Get matched with the nearest driver',
    price: 5,
    icon: <Star className="w-5 h-5" />
  },
  {
    id: 'wait_time',
    name: 'Extra Wait Time',
    description: '15 minutes of complimentary wait time',
    price: 3,
    icon: <Clock className="w-5 h-5" />
  },
  {
    id: 'security',
    name: 'Security Features',
    description: 'Enhanced safety and security measures',
    price: 7,
    icon: <Shield className="w-5 h-5" />
  }
];

const ServiceStep: React.FC<ServiceStepProps> = ({
  bookingData,
  onUpdate,
  onNext,
  onBack
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>(
    bookingData.vehicleType || 'economy'
  );
  const [selectedServices, setSelectedServices] = useState<string[]>(
    bookingData.additionalServices || []
  );
  const [passengers, setPassengers] = useState<number>(
    bookingData.passengers || 1
  );

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    const vehiclePrice = vehicleTypes.find(v => v.id === selectedVehicle)?.price || 0;
    const servicesPrice = selectedServices.reduce((total, serviceId) => {
      const service = serviceOptions.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
    return vehiclePrice + servicesPrice;
  };

  const handleNext = () => {
    onUpdate({
      vehicleType: selectedVehicle,
      additionalServices: selectedServices,
      passengers,
      estimatedPrice: calculateTotal()
    });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Ride</h2>
        <p className="text-gray-400">Select a vehicle and additional services</p>
      </div>

      {/* Vehicle Selection */}
      <div className="grid grid-cols-2 gap-4">
        {vehicleTypes.map((vehicle) => (
          <motion.button
            key={vehicle.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleVehicleSelect(vehicle.id)}
            className={`
              p-6 glass-card text-left transition-all
              ${selectedVehicle === vehicle.id
                ? 'border-taxi-yellow ring-2 ring-taxi-yellow/30'
                : 'hover:border-taxi-yellow/30'
              }
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-taxi-yellow/20 flex items-center justify-center">
                  {vehicle.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{vehicle.name}</h3>
                  <p className="text-sm text-gray-400">{vehicle.description}</p>
                </div>
              </div>
              <div className="text-taxi-yellow font-medium">
                ${vehicle.price}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <Users className="w-4 h-4 mr-2" />
                Up to {vehicle.capacity} passengers
              </div>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Passenger Count */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium text-white mb-4">Number of Passengers</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPassengers(prev => Math.max(1, prev - 1))}
            className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white/5"
          >
            -
          </button>
          <span className="text-xl font-medium text-white">{passengers}</span>
          <button
            onClick={() => setPassengers(prev => Math.min(6, prev + 1))}
            className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white/5"
          >
            +
          </button>
        </div>
      </div>

      {/* Additional Services */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium text-white mb-4">Additional Services</h3>
        <div className="grid grid-cols-3 gap-4">
          {serviceOptions.map((service) => (
            <motion.button
              key={service.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleService(service.id)}
              className={`
                p-4 rounded-lg border transition-all
                ${selectedServices.includes(service.id)
                  ? 'border-taxi-yellow bg-taxi-yellow/10'
                  : 'border-gray-600 hover:border-taxi-yellow/30'
                }
              `}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-taxi-yellow/20 flex items-center justify-center">
                  {service.icon}
                </div>
                <div>
                  <div className="font-medium text-white">{service.name}</div>
                  <div className="text-sm text-gray-400">{service.description}</div>
                  <div className="text-taxi-yellow font-medium mt-1">+${service.price}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-white">Estimated Total</h3>
            <p className="text-sm text-gray-400">Final price may vary based on actual distance</p>
          </div>
          <div className="text-2xl font-bold text-taxi-yellow">
            ${calculateTotal()}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-taxi-yellow text-night-black rounded-lg hover:bg-taxi-yellow/90 transition-colors"
        >
          Continue to Confirmation
        </button>
      </div>
    </div>
  );
};

export default ServiceStep; 