import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Location } from '@/types/location';
import { Route } from '@/types/route';
import { CarCategory } from '@/types/booking';

export interface Booking {
  id: string;
  userId: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  route: Route | null;
  date: string;
  time: string;
  passengers: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  carCategory?: CarCategory;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BookingState {
  currentBooking: Booking | null;
  bookingHistory: Booking[];
  isLoading: boolean;
  error: string | null;
  // Actions
  setCurrentBooking: (booking: Booking | null) => void;
  addToHistory: (booking: Booking) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  clearCurrentBooking: () => void;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      currentBooking: null,
      bookingHistory: [],
      isLoading: false,
      error: null,

      setCurrentBooking: (booking) => 
        set({ currentBooking: booking }),

      addToHistory: (booking) =>
        set((state) => ({
          bookingHistory: [booking, ...state.bookingHistory],
          currentBooking: null,
        })),

      updateBookingStatus: (bookingId, status) =>
        set((state) => ({
          bookingHistory: state.bookingHistory.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status, updatedAt: new Date() }
              : booking
          ),
          currentBooking:
            state.currentBooking?.id === bookingId
              ? { ...state.currentBooking, status, updatedAt: new Date() }
              : state.currentBooking,
        })),

      clearCurrentBooking: () =>
        set({ currentBooking: null }),

      clearError: () =>
        set({ error: null }),
    }),
    {
      name: 'booking-storage',
      partialize: (state) => ({
        bookingHistory: state.bookingHistory,
      }),
    }
  )
); 