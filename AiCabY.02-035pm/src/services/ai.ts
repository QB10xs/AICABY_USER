import { ChatState } from '@/types/chat';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

interface CompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

async function callDeepSeekAPI(message: string, style: ChatState['currentBookingStyle']): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    console.error('DeepSeek API key is missing in environment variables');
    throw new Error('DeepSeek API key is not configured');
  }

  console.log('DeepSeek API Key present:', !!DEEPSEEK_API_KEY);
  console.log('Making request to DeepSeek API...');

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
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
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    console.log('DeepSeek API Response Status:', response.status);

    const responseData: CompletionResponse = await response.json();
    console.log('DeepSeek API Raw Response:', responseData);

    if (!response.ok) {
      throw new Error(`DeepSeek API request failed: ${response.status} - ${responseData?.error?.message || 'Unknown error'}`);
    }

    if (!responseData.choices?.length) {
      console.error('DeepSeek API Response has no choices:', responseData);
      throw new Error('Invalid response format: No choices array in response');
    }

    if (!responseData.choices[0]?.message?.content) {
      console.error('Invalid DeepSeek API response format:', responseData);
      throw new Error('Invalid response format: No message content in first choice');
    }

    return responseData.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    throw error;
  }
}

async function callOpenRouterAPI(message: string, style: ChatState['currentBookingStyle']): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API key is missing in environment variables');
    throw new Error('OpenRouter API key is not configured');
  }

  console.log('OpenRouter API Key present:', !!OPENROUTER_API_KEY);
  console.log('Making request to OpenRouter API...');

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AICABY'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4-turbo-preview',
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
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    console.log('OpenRouter API Response Status:', response.status);

    const responseData: CompletionResponse = await response.json();
    console.log('OpenRouter API Raw Response:', responseData);

    if (!response.ok) {
      throw new Error(`OpenRouter API request failed: ${response.status} - ${responseData?.error?.message || 'Unknown error'}`);
    }

    if (!responseData.choices?.length) {
      console.error('OpenRouter API Response has no choices:', responseData);
      throw new Error('Invalid response format: No choices array in response');
    }

    if (!responseData.choices[0]?.message?.content) {
      console.error('Invalid OpenRouter API response format:', responseData);
      throw new Error('Invalid response format: No message content in first choice');
    }

    return responseData.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
}

export async function generateResponse(
  message: string, 
  style: ChatState['currentBookingStyle']
): Promise<string> {
  if (!message.trim()) {
    throw new Error('Message cannot be empty');
  }

  try {
    console.log('Attempting to use DeepSeek API...');
    return await callDeepSeekAPI(message, style);
  } catch (deepseekError) {
    const deepseekMessage = deepseekError instanceof Error ? 
      deepseekError.message : 
      'Unknown DeepSeek error';
    
    console.error('DeepSeek API failed:', deepseekMessage);
    
    try {
      console.log('Falling back to OpenRouter API...');
      return await callOpenRouterAPI(message, style);
    } catch (openRouterError) {
      const openRouterMessage = openRouterError instanceof Error ?
        openRouterError.message :
        'Unknown OpenRouter error';
      
      console.error('OpenRouter API failed:', openRouterMessage);
      throw new Error(`Both AI services failed to respond.\nDeepSeek error: ${deepseekMessage}\nOpenRouter error: ${openRouterMessage}`);
    }
  }
}
