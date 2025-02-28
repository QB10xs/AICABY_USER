import React from 'react';
import { motion } from 'framer-motion';
import { ChatMessage } from './ChatMessage';
import { useChatStore } from '@/stores/chatStore';
import { useBookingStore } from '@/stores/bookingStore';

export const AICabyInterface: React.FC = () => {
  const { messages, isTyping } = useChatStore();
  const { bookingMode, setBookingMode } = useBookingStore();
  const [newMessage, setNewMessage] = React.useState('');

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      // Add message to chat store
      await useChatStore.getState().addMessage({
        type: 'user',
        content: newMessage.trim(),
        timestamp: new Date(),
      });
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-8">
      {/* AI CABY Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl">🚕</span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-taxi-yellow to-yellow-400 bg-clip-text text-transparent">
            AI CABY
          </h1>
        </div>
        <p className="text-xl text-zinc-400">Your AI-Powered Taxi Experience</p>
      </div>

      {/* Booking Mode Selection */}
      <div className="max-w-md mx-auto bg-night-black/80 p-6 rounded-2xl backdrop-blur-sm border border-taxi-yellow/20 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Select Your Booking Method</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setBookingMode('ai')}
            className={`p-4 rounded-xl transition-all flex flex-col items-center gap-2 ${
              bookingMode === 'ai'
                ? 'bg-taxi-yellow text-night-black scale-105 shadow-xl'
                : 'bg-white/5 text-white/80 hover:bg-white/10'
            }`}
          >
            <span className="text-2xl mb-1">🤖</span>
            <span className="font-semibold">AI Assistant</span>
            <span className="text-xs opacity-80">Chat naturally to book</span>
          </button>
          <button
            onClick={() => setBookingMode('manual')}
            className={`p-4 rounded-xl transition-all flex flex-col items-center gap-2 ${
              bookingMode === 'manual'
                ? 'bg-taxi-yellow text-night-black scale-105 shadow-xl'
                : 'bg-white/5 text-white/80 hover:bg-white/10'
            }`}
          >
            <span className="text-2xl mb-1">📝</span>
            <span className="font-semibold">Manual Booking</span>
            <span className="text-xs opacity-80">Step by step process</span>
          </button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-2xl mx-auto bg-night-black/80 p-6 rounded-2xl backdrop-blur-sm border border-taxi-yellow/20 shadow-2xl">
        <div className="space-y-6 mb-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isTyping && (
            <div className="flex items-center space-x-2 p-4 bg-white/5 rounded-xl">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse delay-200"></div>
            </div>
          )}
        </div>
        
        {/* Chat Input */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 focus:border-taxi-yellow focus:ring-2 focus:ring-taxi-yellow/20 outline-none text-white placeholder-white/40"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-2.5 rounded-xl transition-all ${
              newMessage.trim()
                ? 'bg-taxi-yellow text-night-black hover:bg-yellow-400'
                : 'bg-white/5 text-white/40'
            }`}
          >
            <span className="text-xl">➤</span>
          </button>
        </div>
      </div>
    </div>
  );
};
