export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  currentBookingStyle: 'quick' | 'detailed' | 'schedule';
}

export interface ChatActions {
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  setTyping: (isTyping: boolean) => void;
  setBookingStyle: (style: ChatState['currentBookingStyle']) => void;
  retryMessage: (messageId: string) => Promise<void>;
}
