import { generateAIResponse } from '../services/aiService';
import { describe, it, expect } from 'vitest';
import type { Booking } from '../types/booking';

describe('AI Service Tests', () => {
  const testCases = [
    {
      input: 'Hello',
      expectedIntent: 'greeting',
    },
    {
      input: 'I need a ride from Central Park to Times Square',
      expectedIntent: 'booking',
    },
    {
      input: 'How do I pay?',
      expectedIntent: 'payment',
    },
    {
      input: 'Where is my driver?',
      expectedIntent: 'location',
    }
  ];

  testCases.forEach(({ input, expectedIntent }) => {
    it(`handles ${expectedIntent} intent correctly`, async () => {
      const response = await generateAIResponse(input, { previousBookings: [] });
      expect(response).toBeDefined();
      expect(response.content).toBeTruthy();
      
      // Log the response for manual verification
      console.log(`Input: ${input}`);
      console.log(`Response: ${response.content}\n`);
    });
  });

  it('should extract booking details from user message', async () => {
    const message = 'I need a ride from Central Park to Times Square';
    const previousBookings: Booking[] = [{
      id: '1',
      userId: 'user123',
      pickupLocation: {
        address: 'Central Park, New York, NY',
        coordinates: { lat: 40.7829, lng: -73.9654 }
      },
      dropoffLocation: {
        address: 'Times Square, New York, NY',
        coordinates: { lat: 40.7580, lng: -73.9855 }
      },
      route: {
        distance: 2500,
        duration: 15,
        polyline: 'encoded_polyline_string'
      },
      status: 'completed' as const,
      date: new Date().toISOString(),
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      passengers: 1,
      price: 25.50,
      driverId: 'driver123',
      rating: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];

    const response = await generateAIResponse(message, { previousBookings });

    expect(response.booking?.pickupLocation?.address).toBe('Central Park');
    expect(response.booking?.dropoffLocation?.address).toBe('Times Square');
  });

  it('handles context from previous bookings', async () => {
    const previousBookings: Booking[] = [{
      id: '1',
      userId: 'test-user',
      pickupLocation: {
        address: '123 Home St',
        coordinates: { lat: 51.5074, lng: -0.1278 }
      },
      dropoffLocation: {
        address: '456 Work Ave',
        coordinates: { lat: 51.5074, lng: -0.1278 }
      },
      route: {
        distance: 5,
        duration: 15,
        polyline: ''
      },
      status: 'completed' as const,
      date: new Date().toISOString(),
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      passengers: 1,
      price: 25,
      driverId: 'driver-1',
      rating: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];

    const response = await generateAIResponse('Hello', { previousBookings });
    expect(response.content).toContain('Welcome back');
  });
}); 