import { Booking } from '@/types/booking';

export interface AIResponse {
  content: string;
  booking?: Partial<Booking>;
}

export async function generateAIResponse(
  _message: string,
  _context: {
    previousBookings?: Booking[];
  }
): Promise<AIResponse> {
  // Simulate AI response delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // For now, return a simple response
  return {
    content: "I understand you'd like to book a ride. I can help you with that. Could you please provide your pickup location and destination?"
  };
}

export function extractBookingDetails(input: string): AIResponse['booking'] | undefined {
  // Basic regex patterns for location extraction
  const pickupPattern = /from\s+([^,]+(?:,[^,]+)*)/i;
  const dropoffPattern = /to\s+([^,]+(?:,[^,]+)*)/i;

  const pickupMatch = input.match(pickupPattern);
  const dropoffMatch = input.match(dropoffPattern);

  if (pickupMatch && dropoffMatch) {
    return {
      pickupLocation: {
        address: pickupMatch[1].trim(),
        name: pickupMatch[1].trim(),
        coordinates: { lat: 0, lng: 0 } // Placeholder coordinates
      },
      dropoffLocation: {
        address: dropoffMatch[1].trim(),
        name: dropoffMatch[1].trim(),
        coordinates: { lat: 0, lng: 0 } // Placeholder coordinates
      }
    };
  }

  return undefined;
} 