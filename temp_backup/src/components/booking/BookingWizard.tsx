import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import LocationStep from './steps/LocationStep';
import DateTimeStep from './steps/DateTimeStep';
import ServiceStep from './steps/ServiceStep';
import ConfirmationStep from './steps/ConfirmationStep';
import type { Booking } from '@/types/booking';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Location',
    description: 'Set pickup & drop-off',
    icon: '📍'
  },
  {
    id: 2,
    title: 'Date & Time',
    description: 'Choose when you want to ride',
    icon: '🕒'
  },
  {
    id: 3,
    title: 'Service',
    description: 'Select vehicle and options',
    icon: '🚕'
  },
  {
    id: 4,
    title: 'Confirm',
    description: 'Review and book',
    icon: '✅'
  }
];

interface BookingWizardProps {
  onComplete: (booking: Booking) => void;
  onCancel: () => void;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<Partial<Booking>>({});

  const updateBookingData = (data: Partial<Booking>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    if (isBookingComplete(bookingData)) {
      onComplete(bookingData as Booking);
    }
  };

  const isBookingComplete = (booking: Partial<Booking>): booking is Booking => {
    return !!(
      booking.pickupLocation &&
      booking.dropoffLocation &&
      booking.date &&
      booking.time &&
      booking.passengers
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex-1 relative ${
                step.id !== steps.length ? 'after:content-[""] after:absolute after:w-full after:h-0.5 after:bg-gray-200 after:top-5 after:transform after:translate-y-1/2' : ''
              }`}
            >
              <div className="relative flex flex-col items-center group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    step.id === currentStep
                      ? 'bg-taxi-yellow text-night-black'
                      : step.id < currentStep
                      ? 'bg-success text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span>{step.icon}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${
                    step.id === currentStep ? 'text-taxi-yellow' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-400">{step.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="glass-card p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <LocationStep
                bookingData={bookingData}
                onUpdate={updateBookingData}
                onNext={handleNext}
              />
            )}
            {currentStep === 2 && (
              <DateTimeStep
                bookingData={bookingData}
                onUpdate={updateBookingData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <ServiceStep
                bookingData={bookingData}
                onUpdate={updateBookingData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <ConfirmationStep
                bookingData={bookingData}
                onComplete={handleComplete}
                onBack={handleBack}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel Booking
        </button>
        <div className="flex gap-4">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingWizard; 