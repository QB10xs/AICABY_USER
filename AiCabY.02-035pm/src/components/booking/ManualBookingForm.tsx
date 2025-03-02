import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Car, CreditCard } from 'lucide-react';
import LocationStep from './steps/LocationStep';
import VehicleSelectionStep, { VehicleCategory } from './steps/VehicleSelectionStep';
import BookingSummary, { PaymentMethod } from './steps/BookingSummary';
import { useAuthStore } from '@/stores/authStore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const steps = [
  { id: 'location', title: 'Location', icon: MapPin },
  { id: 'vehicle', title: 'Vehicle', icon: Car },
  { id: 'payment', title: 'Payment', icon: CreditCard },
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
  onComplete: (data: any) => void;
  onCancel: () => void;
  isGuest?: boolean;
}

interface FormData {
  pickupLocation: string;
  dropoffLocation: string;
  phoneNumber: string;
  email?: string;
  vehicleType: string;
  paymentMethod: string;
  isScheduled: boolean;
  scheduledTime?: string;
}

const ManualBookingForm: React.FC<ManualBookingFormProps> = ({ onComplete, onCancel, isGuest = false }) => {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<BookingFormData>({
    pickupLocation: null,
    dropoffLocation: null,
    distance: 0,
    duration: 0,
    selectedVehicle: null,
    paymentMethod: null,
    isScheduled: false
  });
  
  const [isScheduling, setIsScheduling] = useState(false);
  const { handleSubmit } = useForm<FormData>();

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
                setIsScheduling(method === 'token');
              }}
              selectedPaymentMethod={formData.paymentMethod || undefined}
            />
          ) : null
        );
      default:
        return null;
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Basic validation
      if (!formData.pickupLocation || !formData.dropoffLocation) {
        toast.error('Please provide both pickup and dropoff locations');
        return;
      }

      if (isGuest && !data.phoneNumber) {
        toast.error('Please provide a contact phone number');
        return;
      }

      const bookingData = {
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        phoneNumber: data.phoneNumber,
        email: isGuest ? data.email : user?.email,
        selectedVehicle: formData.selectedVehicle,
        paymentMethod: formData.paymentMethod,
        isScheduled: isScheduling,
        scheduledTime: isScheduling ? data.scheduledTime : undefined,
        distance: formData.distance,
        duration: formData.duration
      };

      onComplete(bookingData);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Failed to process booking. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center ${
              index < steps.length - 1 ? 'flex-1' : ''
            }`}
          >
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${currentStep >= index ? 'bg-[#F7C948] text-[#2A2A2A]' : 'bg-white/10 text-white/50'}
              `}
            >
              <step.icon className="w-5 h-5" />
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-2
                  ${currentStep > index ? 'bg-[#F7C948]' : 'bg-white/10'}
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBack}
          className="px-6 py-2 rounded-lg font-medium bg-white/5 text-white hover:bg-white/10"
        >
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit(onSubmit)}
          disabled={!isStepValid()}
          className={`
            px-6 py-2 rounded-lg font-medium transition-all duration-200
            ${isStepValid()
              ? 'bg-[#F7C948] text-[#2A2A2A] hover:bg-[#F7C948]/90'
              : 'bg-white/5 text-white/50 cursor-not-allowed'
            }
          `}
        >
          {currentStep === steps.length - 1 
            ? 'Complete Booking' 
            : 'Next'
          }
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ManualBookingForm;