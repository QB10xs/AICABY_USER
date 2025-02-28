import { create } from 'zustand';
import { ChatState, ChatActions, Message } from '@/types/chat';
import { generateResponse } from '@/services/ai';
import { simulateTyping, getSearchingDriverMessage, sleep } from '@/utils/chat';

interface ChatStore extends ChatState, ChatActions {
  userLanguage: string;
  setUserLanguage: (language: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isTyping: false,
  currentBookingStyle: 'quick',
  userLanguage: 'en' as string,

  addMessage: async (message) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...message,
    };

    // Add user message immediately
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));

    // If it's a user message, generate AI response
    if (message.type === 'user') {
      set({ isTyping: true });
      
      try {
        // Start typing after 2 seconds
        await sleep(2000);
        set({ isTyping: true });

        // Get AI response
        const response = await generateResponse(message.content, get().currentBookingStyle);
        
        // Check if this is a booking-related message
        const isBookingMessage = response.toLowerCase().includes('book') || 
          response.toLowerCase().includes('ride') || 
          response.toLowerCase().includes('taxi') || 
          response.toLowerCase().includes('driver');

        // Show the response
        await simulateTyping(response);
        
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: response,
          timestamp: new Date(),
          status: 'sent',
        };

        set((state) => ({
          messages: [...state.messages, aiMessage],
          isTyping: isBookingMessage // Keep typing if booking message
        }));

        // If booking message, show searching for driver message
        if (isBookingMessage) {
          await sleep(1000); // Small pause
          const driverSearchMessage = getSearchingDriverMessage(get().userLanguage as 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ar');
          await simulateTyping(driverSearchMessage);

          const searchMessage: Message = {
            id: Date.now().toString(),
            type: 'assistant',
            content: driverSearchMessage,
            timestamp: new Date(),
            status: 'sent',
          };

          set((state) => ({
            messages: [...state.messages, searchMessage],
            isTyping: false
          }));
        }

        set((state) => ({
          messages: [...state.messages, aiMessage],
          isTyping: false,
        }));
      } catch (error) {
        console.error('Error generating response:', error);
        set({ isTyping: false });
      }
    }
  },

  setTyping: (isTyping) => set({ isTyping }),
  
  setUserLanguage: (language: string) => set({ userLanguage: language }),

  clearMessages: () => set({ messages: [] }),
  
  setBookingStyle: (style) => set({ currentBookingStyle: style }),
  
  retryMessage: async (messageId) => {
    const messages = get().messages;
    const messageIndex = messages.findIndex(m => m.id === messageId);
    
    if (messageIndex === -1) return;
    
    const message = messages[messageIndex];
    if (message.type !== 'user') return;
    
    // Remove the failed message and its response
    set((state) => ({
      messages: state.messages.slice(0, messageIndex)
    }));
    
    // Retry sending the message
    await get().addMessage({
      type: 'user',
      content: message.content
    });
  }
}));
