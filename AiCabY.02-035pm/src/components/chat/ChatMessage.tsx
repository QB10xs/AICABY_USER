import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '@/types/chat';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex gap-3 ${message.type === 'assistant' ? 'items-start' : 'items-end justify-end'} mb-3`}
  >
    {message.type === 'assistant' && (
      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
        <span className="text-sm">🚕</span>
      </div>
    )}
    <div
      className={`rounded-2xl p-3 max-w-[80%] ${message.type === 'assistant'
        ? 'bg-zinc-800/50 backdrop-blur-sm text-white'
        : 'bg-taxi-yellow text-night-black'} 
        ${message.type === 'assistant' ? 'rounded-tl-sm' : 'rounded-tr-sm'}
        shadow-lg border border-white/5
      `}
    >
      <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
      <p className={`text-[11px] mt-1.5 ${message.type === 'assistant' ? 'text-zinc-400' : 'text-night-black/60'} text-right`}>
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
