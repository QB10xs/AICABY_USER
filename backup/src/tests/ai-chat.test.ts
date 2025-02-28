import { generateAIResponse } from '@/services/aiService';
import { trainingService } from '@/services/trainingService';

describe('AI Chat Functionality Tests', () => {
  beforeAll(async () => {
    // Load training data
    await trainingService.loadTrainingData(require('@/data/training.json'));
  });

  const testCases = [
    {
      name: 'Basic booking request',
      input: 'I need a taxi from Amsterdam Central to Schiphol Airport',
    },
    {
      name: 'Booking with time',
      input: 'Book a taxi from Rotterdam Station to The Hague at 14:30',
    },
    {
      name: 'Price inquiry',
      input: 'How much is a ride from Utrecht to Amsterdam?',
    },
    {
      name: 'Price Estimate',
      input: 'How much will it cost from Amsterdam Central to Rotterdam Central?',
      expectedIntent: 'price_estimate',
      expectedEntities: ['pickup', 'dropoff']
    },
    {
      name: 'Travel Time Inquiry',
      input: 'How long does it take from Rotterdam Central to The Hague?',
      expectedIntent: 'duration_estimate',
      expectedEntities: ['pickup', 'dropoff']
    },
    {
      name: 'Wheelchair Accessibility',
      input: 'Do you have wheelchair accessible vehicles?',
      expectedIntent: 'accessibility_inquiry',
      expectedEntities: ['vehicle_type']
    },
    {
      name: 'Group Booking',
      input: 'I need transportation for a group of 6 people',
      expectedIntent: 'group_booking',
      expectedEntities: ['passengers']
    },
    {
      name: 'Lost Item Report',
      input: 'I left my phone in the taxi last night',
      expectedIntent: 'lost_item',
      expectedEntities: ['item', 'time']
    },
    {
      name: 'Business Invoice Request',
      input: 'I need a business invoice for my last ride',
      expectedIntent: 'invoice_request',
      expectedEntities: ['type']
    },
    {
      name: 'Airport Pickup with Flight',
      input: 'I need a pickup from Schiphol Airport, my flight arrives at 15:30',
      expectedIntent: 'airport_pickup',
      expectedEntities: ['pickup', 'time']
    },
    {
      name: 'Booking Cancellation',
      input: 'I need to cancel my booking #P2P-87492',
      expectedIntent: 'cancel_booking',
      expectedEntities: ['booking_reference']
    },
    {
      name: 'Multi-language Support',
      input: 'Ik heb een taxi nodig van Amsterdam naar Rotterdam',
      expectedIntent: 'booking_request',
      expectedEntities: ['pickup', 'dropoff']
    }
  ];

  testCases.forEach(({ name, input }) => {
    test(name, async () => {
      const response = await generateAIResponse(input, {});
      expect(response.content).toBeTruthy();
      // Add more specific assertions based on expected response format
    });
  });
}); 