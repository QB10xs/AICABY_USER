import { create } from 'zustand';
import { ChatState, ChatActions, Message } from '@/types/chat';
import { generateResponse } from '@/services/ai';

interface ChatStore extends ChatState, ChatActions {}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isTyping: false,
  currentBookingStyle: 'quick',

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
        const response = await generateResponse(message.content, get().currentBookingStyle);
        
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: response,
          timestamp: new Date(),
          status: 'sent',
        };

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
