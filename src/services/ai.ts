import { ChatState } from '@/types/chat';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

async function callDeepSeekAPI(message: string, style: ChatState['currentBookingStyle']): Promise<string> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat-v1',
      messages: [
        {
          role: 'system',
          content: `You are AI CABY, a helpful taxi booking assistant. Your goal is to assist users in booking a taxi ${style} and efficiently. Be concise and helpful, understand user intent quickly, and provide clear, actionable information.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error('Failed to get DeepSeek AI response');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callOpenRouterAPI(message: string, style: ChatState['currentBookingStyle']): Promise<string> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AICABY'
    },
    body: JSON.stringify({
      model: 'deepseek-ai/deepseek-chat-v1',
      messages: [
        {
          role: 'system',
          content: `You are AI CABY, a helpful taxi booking assistant. Your goal is to assist users in booking a taxi ${style} and efficiently. Be concise and helpful, understand user intent quickly, and provide clear, actionable information.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error('Failed to get OpenRouter AI response');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function generateResponse(
  message: string, 
  style: ChatState['currentBookingStyle']
): Promise<string> {
  try {
    // Try DeepSeek first
    try {
      console.log('Attempting to use DeepSeek API...');
      const response = await callDeepSeekAPI(message, style);
      console.log('DeepSeek API call successful');
      return response;
    } catch (deepseekError) {
      console.warn('DeepSeek API failed, falling back to OpenRouter:', deepseekError);
      
      // Try OpenRouter as fallback
      try {
        console.log('Attempting to use OpenRouter API...');
        const response = await callOpenRouterAPI(message, style);
        console.log('OpenRouter API call successful');
        return response;
      } catch (openrouterError) {
        console.error('OpenRouter API failed:', openrouterError);
        throw new Error('Both AI services failed');
      }
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    // Fallback to static responses if both APIs fail
    const responses = {
      quick: "I can help you book a ride quickly. Where would you like to go?",
      detailed: "Let's get all the details for your ride. First, could you specify your pickup location?",
      schedule: "I'll help you schedule a ride. When would you like to be picked up?"
    };
    return responses[style];
  }
}
