import { Booking } from '@/types/booking';
import { generateResponse } from './ai';
import { trainingService } from './trainingService';

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  console.error('Missing DeepSeek API key');
}

export interface AIResponse {
  content: string;
  booking?: Partial<Booking>;
  lastQuestion?: string;
  pendingLocation?: {
    address: string;
    type: 'pickup' | 'dropoff' | undefined;
  };
}

interface ConversationContext {
  lastQuestion?: string;
  pendingLocation?: {
    address: string;
    type: 'pickup' | 'dropoff' | undefined;
  };
    previousBookings?: Booking[];
  }

// Helper function to check if response is affirmative
function isAffirmativeResponse(message: string): boolean {
  const affirmativeResponses = ['yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'yup', 'y'];
  return affirmativeResponses.includes(message.toLowerCase().trim());
}

// Helper function to generate contextual responses
async function generateContextualResponse(
  intent: string,
  message: string,
  context: ConversationContext
): Promise<AIResponse> {
  const messageLower = message.toLowerCase().trim();
  
  console.log('Processing message:', message);
  console.log('With context:', JSON.stringify(context, null, 2));
  
  // Try to find a matching example from training data first
  const matchingExample = trainingService.findMatchingExample(message);
  if (matchingExample) {
    console.log('Found matching training example:', matchingExample);
    return {
      content: matchingExample.aiResponse,
      booking: matchingExample.context?.booking,
      lastQuestion: matchingExample.context?.lastQuestion,
      pendingLocation: matchingExample.context?.pendingLocation
    };
  }

  // Special handling for "hi" messages to prevent loops
  if (messageLower === 'hi' || messageLower === 'hello' || messageLower === 'hey') {
    return {
      content: "Hello! I'm your AICABY assistant. I can help you book a ride, find locations, or manage payments. What would you like to do today?"
    };
  }
  
  // Handle pickup/dropoff specification directly
  if (messageLower === 'pickup' || messageLower === 'dropoff') {
    if (!context.pendingLocation) {
      return {
        content: "I'll help you set a location. Please provide the address you'd like to use."
      };
    } else {
      const locationType = messageLower as 'pickup' | 'dropoff';
      const otherType = locationType === 'pickup' ? 'dropoff' : 'pickup';
      
      return {
        content: `Great! I've set ${context.pendingLocation.address} as your ${locationType} point. Could you please provide your ${otherType} location?`,
        booking: {
          [`${locationType}Location`]: {
            name: context.pendingLocation.address,
            address: context.pendingLocation.address,
            coordinates: { lat: 0, lng: 0 }
          }
        },
        pendingLocation: {
          address: context.pendingLocation.address,
          type: locationType
        }
      };
    }
  }
  
  // Handle affirmative responses
  if (isAffirmativeResponse(messageLower) && context.lastQuestion?.includes('pickup or dropoff')) {
    return {
      content: "Please specify if this is your 'pickup' or 'dropoff' location by typing one of those words.",
      lastQuestion: "pickup or dropoff",
      pendingLocation: context.pendingLocation
    };
  }
  
  // Try to use AI for more natural responses
  try {
    // Check if the message contains location information first
    const bookingDetails = extractBookingDetails(message);
    if (bookingDetails) {
      return {
        content: `Great! I can help you book a ride from ${bookingDetails.pickupLocation?.address} to ${bookingDetails.dropoffLocation?.address}. When would you like to be picked up?`,
        booking: bookingDetails
      };
    }
    
    // If the message appears to be a location (and not a command or question)
    if (messageLower.match(/^[a-z0-9\s,.-]+$/i) && 
        !messageLower.includes('?') && 
        !['pickup', 'dropoff', 'yes', 'no', 'ok', 'okay'].includes(messageLower)) {
  return {
        content: "Thanks for providing the location. Would you like to set this as your pickup or dropoff point?",
        booking: undefined,
        lastQuestion: "pickup or dropoff",
        pendingLocation: {
          address: message.trim(),
          type: undefined
        }
      };
    }
    
    // Create a prompt that includes the conversation context and training examples
    const contextPrompt = `
You are AI CABY, a helpful taxi booking assistant. The user message is: "${message}"

Current conversation context:
- User intent: ${intent}
- Previous question asked: ${context.lastQuestion || 'None'}
- Pending location: ${context.pendingLocation ? context.pendingLocation.address : 'None'}
- Pending location type: ${context.pendingLocation?.type || 'Not specified'}

Your task is to help the user book a taxi. Respond naturally and helpfully.
`;

    // Call the AI service
    const aiResponse = await generateResponse(contextPrompt, 'detailed');
    
    // Return the AI response
    return {
      content: aiResponse
    };
  } catch (error) {
    console.error('Error generating AI response, falling back to rule-based responses:', error);
    
    // Fallback to rule-based responses
    switch (intent) {
      case 'booking':
        return {
          content: "I'll help you book a ride. Could you please tell me your pickup location?"
        };

      case 'location':
        return {
          content: "I can help you set your location. Would you like to use your current location, or would you prefer to enter a specific address?"
        };

      case 'payment':
        return {
          content: "I can help you with payments. We accept credit/debit cards and digital wallets. Would you like to add a new payment method or use an existing one?"
        };

      case 'greeting':
        return {
          content: "Hello! I'm your AICABY assistant. I can help you book a ride, find locations, or manage payments. What would you like to do today?"
        };

      case 'query':
        if (messageLower.includes('how') && messageLower.includes('book')) {
          return {
            content: "Booking a ride is easy! Just tell me your pickup and dropoff locations, and I'll guide you through the process. Would you like to start booking now?"
          };
        }
        if (messageLower.includes('payment')) {
          return {
            content: "We accept various payment methods including credit cards, debit cards, and digital wallets. Would you like to know more about a specific payment option?"
          };
        }
        return {
          content: "I'm here to help! I can assist you with booking rides, finding locations, or managing payments. What specific information would you like to know?"
        };

      default:
        return {
          content: "I'm here to help with your transportation needs. You can ask me about booking a ride, finding locations, or managing payments. What would you like to do?"
        };
    }
  }
}

// Helper function to analyze user intent
function analyzeIntent(message: string): { intent: string } {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('book') || messageLower.includes('ride') || messageLower.includes('taxi')) {
    return { intent: 'booking' };
  }
  
  if (messageLower.includes('location') || messageLower.includes('where') || messageLower.includes('place')) {
    return { intent: 'location' };
  }
  
  if (messageLower.includes('pay') || messageLower.includes('card') || messageLower.includes('money')) {
    return { intent: 'payment' };
  }
  
  if (messageLower.includes('hi') || messageLower.includes('hello') || messageLower.includes('hey')) {
    return { intent: 'greeting' };
  }
  
  if (messageLower.includes('?')) {
    return { intent: 'query' };
  }
  
  return { intent: 'unknown' };
}

// Helper function to extract booking details from message
function extractBookingDetails(message: string): Partial<Booking> | null {
  // This is a simple implementation - you might want to use a more sophisticated NLP solution
  const fromMatch = message.match(/from\s+([^to]+)(?:\s+to|$)/i);
  const toMatch = message.match(/to\s+([^from]+)$/i);
  
  if (fromMatch && toMatch) {
    return {
      pickupLocation: {
        address: fromMatch[1].trim(),
        coordinates: { lat: 0, lng: 0 }
      },
      dropoffLocation: {
        address: toMatch[1].trim(),
        coordinates: { lat: 0, lng: 0 }
      }
    };
  }
  
  return null;
}

export async function generateAIResponse(
  message: string,
  context: ConversationContext = {}
): Promise<AIResponse & { lastQuestion?: string; pendingLocation?: { address: string; type: 'pickup' | 'dropoff' | undefined } }> {
  try {
    const { intent } = analyzeIntent(message);
    console.log('User intent:', intent);
    console.log('Context:', context);
    
    // Add a small delay to make the interaction feel more natural
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    
    const response = await generateContextualResponse(intent, message, context);
    console.log('AI response:', response);
    
    if (!response) {
      throw new Error('No response from AI service');
    }

    return {
      ...response,
      lastQuestion: response.lastQuestion,
      pendingLocation: response.pendingLocation
    };
  } catch (error) {
    console.error('Error in AI response generation:', error);
    throw new Error('Failed to generate AI response. Please try again.');
  }
} 