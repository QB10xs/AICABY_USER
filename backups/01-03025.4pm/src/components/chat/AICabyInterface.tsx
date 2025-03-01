import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatMessage } from './ChatMessage';
import { ShortcutDrawer } from './ShortcutDrawer';
import { useChatStore } from '@/stores/chatStore';
import { useBookingStore } from '@/stores/bookingStore';

export const AICabyInterface: React.FC = () => {
  const [isShortcutOpen, setIsShortcutOpen] = useState(false);
  const { messages, isTyping } = useChatStore();
  const { bookingMode, setBookingMode } = useBookingStore();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      // Add message to chat store
      await useChatStore.getState().addMessage({
        type: 'user',
        content: newMessage.trim(),
      });
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[100vh] bg-gradient-to-b from-night-black to-zinc-900 overflow-hidden">
      {/* AICABY Header - Minimal */}
      <div className="flex items-center justify-between px-4 py-3 bg-night-black/80 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚕</span>
          <h1 className="text-lg font-bold bg-gradient-to-r from-taxi-yellow to-yellow-400 bg-clip-text text-transparent">
            AICABY
          </h1>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <span className="text-xl">⋮</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent" id="chat-messages">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={message.id || index} message={message} />
          ))}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🚕</span>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 inline-flex items-center gap-2"
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-taxi-yellow rounded-full animate-typing" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-taxi-yellow rounded-full animate-typing" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-taxi-yellow rounded-full animate-typing" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            </div>
          )}
          <div ref={messagesEndRef} />
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

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🚕</span>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-4 inline-flex items-center gap-2"
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-taxi-yellow rounded-full animate-typing" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-taxi-yellow rounded-full animate-typing" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-taxi-yellow rounded-full animate-typing" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Input - Fixed at Bottom */}
      <div className="sticky bottom-0 left-0 right-0 bg-night-black/95 backdrop-blur-lg border-t border-white/5 pt-2 pb-4 px-4 mt-auto">
        <div className="absolute inset-x-0 -top-16 bg-gradient-to-t from-night-black/95 to-transparent pointer-events-none h-16" />
        <div className="relative max-w-3xl mx-auto">
          <div className="relative flex items-center gap-2 bg-zinc-800/50 rounded-full p-1.5 pr-2 shadow-lg border border-white/5">
            {/* Shortcut Button */}
            <button
              onClick={() => setIsShortcutOpen(!isShortcutOpen)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-taxi-yellow"
            >
              <span className="text-xl">⚡️</span>
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-zinc-500 min-w-0 text-base px-2"
            />
            
            <button
              onClick={() => {}}
              className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
            >
              <span className="text-xl">🎤</span>
            </button>
            
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
          
          {/* Shortcut Drawer */}
          <ShortcutDrawer isOpen={isShortcutOpen} onClose={() => setIsShortcutOpen(false)} />
        </div>
      </div>
    </div>
  );
};