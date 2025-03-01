import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking } from '@/types/booking';

interface BookingContextType {
  currentBooking: Booking | null;
  setCurrentBooking: (booking: Booking | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  return (
    <BookingContext.Provider value={{ currentBooking, setCurrentBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}; 