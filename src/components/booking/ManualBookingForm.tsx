import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Car, CreditCard, UserCircle } from 'lucide-react';
import LocationStep from './steps/LocationStep';
import VehicleSelectionStep, { VehicleCategory } from './steps/VehicleSelectionStep';
import BookingSummary, { PaymentMethod } from './steps/BookingSummary';
import DriverMatching, { DriverMatch } from './steps/DriverMatching';

const steps = [
  { id: 'location', title: 'Location', icon: MapPin },
  { id: 'vehicle', title: 'Vehicle', icon: Car },
  { id: 'payment', title: 'Payment', icon: CreditCard },
  { id: 'driver', title: 'Driver', icon: UserCircle },
];

import type { Location } from '@/types/location';

import type { Booking } from '@/types/booking';

interface BookingFormData {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  distance: number;
  duration: number;
  selectedVehicle: VehicleCategory | null;
  paymentMethod: PaymentMethod['id'] | null;
  isScheduled: boolean;
  scheduledTime?: Date;
  date?: string;
  time?: string;
  passengers?: number;
  notes?: string;
  price?: number;
  vehicleType?: string;
  additionalServices?: string[];
  estimatedPrice?: number;
}

interface ManualBookingFormProps {
  onComplete: (bookingData: BookingFormData) => void;
  onCancel: () => void;
}

const ManualBookingForm: React.FC<ManualBookingFormProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<BookingFormData>({
    pickupLocation: null,
    dropoffLocation: null,
    distance: 0,
    duration: 0,
    selectedVehicle: null,
    paymentMethod: null,
    isScheduled: false,
  });
  
  const [driver, setDriver] = useState<DriverMatch | null>(null);
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);

  const handleNext = async () => {
    if (currentStep === steps.length - 2) { // Before the driver step
      setIsSearchingDriver(true);
      // Simulate driver search
      setTimeout(() => {
        setDriver({
          id: 'driver-1',
          name: 'John Smith',
          rating: 4.8,
          vehicle: {
            make: 'Toyota',
            model: 'Camry',
            color: 'Silver',
            plate: 'ABC 123',
            image: '/vehicles/camry.png'
          },
          eta: 5,
          location: {
            lat: 0,
            lng: 0
          }
        });
        setIsSearchingDriver(false);
        setCurrentStep(currentStep + 1);
      }, 3000);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };



  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.pickupLocation && formData.dropoffLocation;
      case 1:
        return formData.selectedVehicle !== null;
      case 2:
        return formData.paymentMethod !== null;
      case 3:
        return driver !== null;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <LocationStep
            formData={formData as unknown as Partial<Booking>}
            onChange={(newData: Partial<Booking>) => {
              setFormData({
                ...formData,
                ...newData,
                selectedVehicle: null,
                paymentMethod: null,
                pickupLocation: newData.pickupLocation as Location | null || null,
                dropoffLocation: newData.dropoffLocation as Location | null || null
              });
            }}
          />
        );
      case 1:
        return (
          <VehicleSelectionStep
            distance={formData.distance}
            onSelect={(vehicle) => {
              setFormData({
                ...formData,
                selectedVehicle: vehicle,
                paymentMethod: null
              });
            }}
            selectedCategory={formData.selectedVehicle?.id}
          />
        );
      case 2:
        return (
          formData.pickupLocation && formData.dropoffLocation && formData.selectedVehicle ? (
            <BookingSummary
              pickup={formData.pickupLocation}
              dropoff={formData.dropoffLocation}
              distance={formData.distance}
              duration={formData.duration}
              selectedVehicle={formData.selectedVehicle}
              isScheduled={formData.isScheduled}
              onPaymentMethodSelect={(method) => {
                setFormData({
                  ...formData,
                  paymentMethod: method
                });
              }}
              selectedPaymentMethod={formData.paymentMethod || undefined}
            />
          ) : null
        );
      case 3:
        return (
          <DriverMatching
            isSearching={isSearchingDriver}
            driver={driver || undefined}
            onViewOnMap={() => {
              // Implement map view toggle
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-[rgba(42,42,42,0.7)] border border-[#F7C948]/20 backdrop-blur-lg p-6 my-4 w-full max-w-6xl mx-auto min-h-[600px] shadow-[0_8px_32px_rgba(247,201,72,0.1)]"
    >
      <h3 className="text-xl font-medium text-[#F7C948] mb-4">
        Book Your Ride
      </h3>
      
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${currentStep === index ? 'bg-[#F7C948] text-[#2A2A2A]' : index < currentStep ? 'bg-[#F7C948]/20 text-[#F7C948]' : 'bg-white/5 text-white/50'}`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`
                  w-24 h-0.5 mx-2
                  ${index < currentStep 
                    ? 'bg-[#F7C948]/20' 
                    : 'bg-white/5'
                  }
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-8 flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBack}
          className="px-6 py-2 rounded-lg bg-night-black/20 text-[#F7C948] hover:bg-night-black/30"
        >
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </motion.button>
        
        <div className="flex items-center gap-2">
          {currentStep === 2 && (
            <button
              onClick={() => setFormData({ ...formData, isScheduled: !formData.isScheduled })}
              className={`
                px-4 py-2 rounded-lg text-sm transition-colors
                ${formData.isScheduled
                  ? 'bg-[#F7C948]/20 text-[#F7C948]'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
                }
              `}
            >
              Schedule for Later
            </button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={!isStepValid() || isSearchingDriver}
            className={`
              px-6 py-2 rounded-lg font-medium transition-all duration-200
              ${isStepValid() && !isSearchingDriver
                ? 'bg-[#F7C948] text-[#2A2A2A] hover:bg-[#F7C948]/90'
                : 'bg-white/5 text-white/50 cursor-not-allowed'
              }
            `}
          >
            {isSearchingDriver 
              ? 'Searching...' 
              : currentStep === steps.length - 1 
                ? 'Complete Booking' 
                : 'Next'
            }
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ManualBookingForm;