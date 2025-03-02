import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Booking as BaseBooking } from '@/types/booking';

export type Booking = BaseBooking;

interface BookingState {
  currentBooking: Booking | null;
  bookingHistory: Booking[];
  isLoading: boolean;
  error: string | null;
  bookingMode: 'ai' | 'manual';
  // Actions
  setCurrentBooking: (booking: Booking | null) => void;
  addToHistory: (booking: Booking) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  clearCurrentBooking: () => void;
  clearError: () => void;
  setBookingMode: (mode: 'ai' | 'manual') => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      currentBooking: null,
      bookingHistory: [],
      isLoading: false,
      error: null,
      bookingMode: 'ai',

      setBookingMode: (mode) => set({ bookingMode: mode }),

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
              ? { ...booking, status, updatedAt: new Date().toISOString() }
              : booking
          ),
          currentBooking:
            state.currentBooking?.id === bookingId
              ? { ...state.currentBooking, status, updatedAt: new Date().toISOString() }
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