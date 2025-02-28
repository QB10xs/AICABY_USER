import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '@/types/chat';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex gap-3 ${message.type === 'assistant' ? 'justify-start' : 'justify-end'} mb-4`}
  >
    {message.type === 'assistant' && (
      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
        <span className="text-sm">🚕</span>
      </div>
    )}
    <div
      className={`rounded-xl p-3 max-w-[80%] ${message.type === 'assistant' 
        ? 'bg-white border border-zinc-200' 
        : 'bg-yellow-500 text-white'}
      `}
    >
      <p className="text-sm">{message.content}</p>
      <p className="text-xs mt-1 opacity-60">
        {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
    {message.type === 'user' && (
      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
        <span className="text-sm text-white">👤</span>
      </div>
    )}
  </motion.div>
);
