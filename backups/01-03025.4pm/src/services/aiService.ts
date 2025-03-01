import { Booking } from '@/types/booking';

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

// Helper function to analyze user intent
function analyzeIntent(message: string): { intent: string } {
  const messageLower = message.toLowerCase();

  // Greeting patterns
  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening))/.test(messageLower)) {
    return { intent: 'greeting' };
  }

  // Booking patterns
  if (/(book|ride|taxi|cab|trip|journey|travel)/i.test(messageLower)) {
    return { intent: 'booking' };
  }

  // Location patterns
  if (/(location|address|where|place|current|here|there|somewhere|pickup|dropoff)/i.test(messageLower)) {
    return { intent: 'location' };
  }

  // Payment patterns
  if (/(pay|payment|card|credit|debit|wallet|cash|money)/i.test(messageLower)) {
    return { intent: 'payment' };
  }

  // Question/Query patterns
  if (/^(what|how|when|where|why|who|can|could|would|will|is|are|do|does|did)/i.test(messageLower)) {
    return { intent: 'query' };
  }

  return { intent: 'default' };
}

interface ConversationContext {
  previousBookings?: Booking[];
  lastQuestion?: string;
  pendingLocation?: {
    address: string;
    type: 'pickup' | 'dropoff' | undefined;
  };
}

// Helper function to check if response is affirmative
function isAffirmativeResponse(message: string): boolean {
  const affirmativeResponses = ['yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'yup', 'y'];
  return affirmativeResponses.includes(message.toLowerCase().trim());
}

// Helper function to generate contextual responses
function generateContextualResponse(
  intent: string,
  message: string,
  context: ConversationContext
): AIResponse {
  const messageLower = message.toLowerCase().trim();
  
  // Handle affirmative responses
  if (isAffirmativeResponse(messageLower) && context.lastQuestion?.includes('pickup or dropoff')) {
    return {
      content: "Would you like this to be your pickup point or dropoff point? Please type 'pickup' or 'dropoff'.",
      booking: context.pendingLocation ? {
        pickupLocation: context.pendingLocation.type === 'pickup' ? {
          name: context.pendingLocation.address,
          address: context.pendingLocation.address,
          coordinates: { lat: 0, lng: 0 }
        } : undefined,
        dropoffLocation: context.pendingLocation.type === 'dropoff' ? {
          name: context.pendingLocation.address,
          address: context.pendingLocation.address,
          coordinates: { lat: 0, lng: 0 }
        } : undefined
      } : undefined
    };
  }

  // Handle pickup/dropoff specification
  if (messageLower === 'pickup' || messageLower === 'dropoff') {
    if (!context.pendingLocation) {
      return {
        content: "I'll help you set a location. Please provide the address you'd like to use."
      };
    }
    
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
      }
    };
  }

  // Check if the message contains location information
  const bookingDetails = extractBookingDetails(message);
  if (bookingDetails) {
    return {
      content: `Great! I can help you book a ride from ${bookingDetails.pickupLocation?.address} to ${bookingDetails.dropoffLocation?.address}. When would you like to be picked up?`,
      booking: bookingDetails
    };
  }

  // If the message appears to be a location
  if (messageLower.match(/^[a-z0-9\s,.-]+$/i) && !messageLower.includes('?')) {
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

export async function generateAIResponse(
  message: string,
  context: ConversationContext = {}
): Promise<AIResponse & { lastQuestion?: string; pendingLocation?: { address: string; type: 'pickup' | 'dropoff' | undefined } }> {
  try {
    const { intent } = analyzeIntent(message);
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    
    const response = await generateContextualResponse(intent, message, context);
    
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

export function extractBookingDetails(input: string): AIResponse['booking'] | undefined {
  // Enhanced regex patterns for location extraction
  const pickupPatterns = [
    /from\s+([^,]+(?:,[^,]+)*)/i,
    /pickup\s+(?:at|from)?\s+([^,]+(?:,[^,]+)*)/i,
    /starting\s+(?:at|from)?\s+([^,]+(?:,[^,]+)*)/i
  ];

  const dropoffPatterns = [
    /to\s+([^,]+(?:,[^,]+)*)/i,
    /drop(?:\s+off)?\s+(?:at|to)?\s+([^,]+(?:,[^,]+)*)/i,
    /going\s+to\s+([^,]+(?:,[^,]+)*)/i
  ];

  let pickupMatch = null;
  let dropoffMatch = null;

  // Try each pattern until we find a match
  for (const pattern of pickupPatterns) {
    pickupMatch = input.match(pattern);
    if (pickupMatch) break;
  }

  for (const pattern of dropoffPatterns) {
    dropoffMatch = input.match(pattern);
    if (dropoffMatch) break;
  }

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