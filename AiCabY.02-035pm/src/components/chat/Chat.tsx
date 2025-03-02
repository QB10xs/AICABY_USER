import React, { useEffect, useRef, useState } from 'react';
import { useAIStore } from '@/stores/aiStore';
import { generateAIResponse } from '@/services/aiService';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const Chat: React.FC = () => {
  const { messages, isProcessing, error, addMessage, setProcessing, setError } = useAIStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Auto-resize textarea
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    setInput(textarea.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    addMessage('user', userMessage);
    setProcessing(true);
    setError(null);

    try {
      const response = await generateAIResponse(userMessage, {});
      if (!response.content) {
        throw new Error('Failed to generate AI response');
      }
      // Add a small delay to make the typing indicator visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      addMessage('assistant', response.content);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to generate response');
    } finally {
      setProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-2">👋</div>
            <p className="text-lg font-medium">Welcome! I'm AICABY</p>
            <p className="text-sm">How can I assist you with your booking today?</p>
          </div>
        )}
        
        {messages.map((message) => (
          <Message
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))}
        
        {isProcessing && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-500 p-4 text-sm">
          {error}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex space-x-4">
          <div className="flex-1 min-h-[44px] relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full px-4 py-2 pr-20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none overflow-hidden min-h-[44px] max-h-[120px]"
              disabled={isProcessing}
              rows={1}
            />
            <div className="absolute right-3 bottom-2 text-xs text-gray-400">
              {isProcessing ? 'Processing...' : 'Press Enter ↵'}
            </div>
          </div>
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className={`
              px-6 py-2 rounded-lg text-white font-medium min-w-[100px]
              ${isProcessing || !input.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90'
              }
            `}
          >
            {isProcessing ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 