import { generateResponse } from '../ai';
import { ChatState } from '@/types/chat';

describe('AI Service Tests', () => {
  const testMessage = "Hello, I need a taxi";
  const testStyle: ChatState['currentBookingStyle'] = 'detailed';

  test('should successfully generate response using DeepSeek API', async () => {
    try {
      const response = await generateResponse(testMessage, testStyle);
      console.log('DeepSeek Response:', response);
      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  test('should fallback to GPT-4 when DeepSeek fails', async () => {
    // Temporarily invalidate DeepSeek API key to force fallback
    const originalKey = process.env.VITE_DEEPSEEK_API_KEY;
    process.env.VITE_DEEPSEEK_API_KEY = 'invalid_key';

    try {
      const response = await generateResponse(testMessage, testStyle);
      console.log('Fallback GPT-4 Response:', response);
      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    } finally {
      // Restore original DeepSeek API key
      process.env.VITE_DEEPSEEK_API_KEY = originalKey;
    }
  });
}); 