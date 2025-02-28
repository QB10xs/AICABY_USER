import { create } from 'zustand';
import { generateUUID } from '@/utils/uuid';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIState {
  messages: Message[];
  isProcessing: boolean;
  error: string | null;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearMessages: () => void;
  setProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAIStore = create<AIState>((set) => ({
  messages: [],
  isProcessing: false,
  error: null,

  addMessage: (role, content) => set((state) => ({
    messages: [...state.messages, {
      id: generateUUID(),
      role,
      content,
      timestamp: new Date(),
    }],
  })),

  clearMessages: () => set({ messages: [] }),
  
  setProcessing: (processing) => set({ isProcessing: processing }),
  
  setError: (error) => set({ error }),
})); 