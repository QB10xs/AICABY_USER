import { Booking } from '@/types/booking';
import { generateResponse } from './ai';
import { trainingService } from './trainingService';

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  console.error('Missing DeepSeek API key');
}

export interface AIResponse {
  content: string;
  lastQuestion?: string;
  pendingLocation?: {
    address: string;
    type: 'pickup' | 'dropoff' | undefined;
  };
  intent?: string;
  suggestions?: string[];
  booking?: Partial<Booking>;
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
  
  // Find matching example for intent and entity extraction
  const matchingExample = trainingService.findMatchingExample(message);
  let extractedIntent = intent;
  let extractedEntities = {};
  
  if (matchingExample) {
    console.log('Found matching training example for intent/entity extraction:', matchingExample);
    extractedIntent = matchingExample.intent || intent;
    extractedEntities = matchingExample.entities || {};
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
  
  try {
    // Create a prompt that includes the conversation context and extracted information
    const contextPrompt = `
You are AI CABY, a helpful taxi booking assistant. The user message is: "${message}"

Current conversation context:
- User intent: ${extractedIntent}
- Previous question asked: ${context.lastQuestion || 'None'}
- Pending location: ${context.pendingLocation ? context.pendingLocation.address : 'None'}
- Pending location type: ${context.pendingLocation?.type || 'Not specified'}
- Extracted entities: ${JSON.stringify(extractedEntities)}

Your task is to help the user book a taxi. Respond naturally and helpfully.
`;

    // Call the AI service (will try DeepSeek first, then fall back to OpenRouter)
    const aiResponse = await generateResponse(contextPrompt, 'detailed');
    
    // Return the AI response with extracted context
    return {
      content: aiResponse,
      booking: extractBookingDetails(message) || undefined,
      lastQuestion: context.lastQuestion,
      pendingLocation: context.pendingLocation
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // If both APIs fail, use rule-based fallback responses
    return generateFallbackResponse(extractedIntent, context);
  }
}

// Helper function for fallback responses when APIs fail
function generateFallbackResponse(intent: string, context: ConversationContext): AIResponse {
  // Use context to generate a more contextual fallback response
  const hasLocation = context?.pendingLocation?.address;
  const lastQuestion = context?.lastQuestion;
  
  let response = "I apologize, but I'm having trouble understanding. ";
  
  if (intent === 'book_ride') {
    if (hasLocation && context?.pendingLocation?.type) {
      response += `I see you want to book a ride ${context.pendingLocation.type === 'pickup' ? 'from' : 'to'} ${context.pendingLocation.address}. `;
    }
    response += "Could you please provide more details about your ride?";
  } else if (intent === 'price_inquiry') {
    response += "To provide an accurate price estimate, I need both pickup and dropoff locations.";
  } else if (lastQuestion) {
    response += `Regarding your previous question about ${lastQuestion}, could you please clarify what you'd like to know?`;
  } else {
    response += "Could you please rephrase your request?";
  }

  return {
    content: response,
    intent,
    suggestions: [
      "Book a ride",
      "Check prices",
      "View my bookings"
    ]
  };
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