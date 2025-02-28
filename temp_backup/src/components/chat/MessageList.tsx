import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@supabase/auth-helpers-react';
import type { Message } from './ChatInterface';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  chatStyle?: 'modern' | 'classic' | 'futuristic';
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping, chatStyle = 'modern' }) => {
  const session = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userName = session?.user?.user_metadata?.full_name || 'Guest';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getMessageAnimation = (type: 'user' | 'assistant') => {
    switch (chatStyle) {
      case 'futuristic':
        return {
          initial: { opacity: 0, scale: 0.8, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          transition: { type: 'spring', stiffness: 200, damping: 20 }
        };
      case 'classic':
        return {
          initial: { opacity: 0, x: type === 'user' ? 20 : -20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.3 }
        };
      case 'modern':
      default:
        return {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.2 }
        };
    }
  };

  const getMessageStyle = (type: 'user' | 'assistant') => {
    const baseStyle = 'max-w-[80%] rounded-2xl p-4 backdrop-blur-lg';
    
    switch (chatStyle) {
      case 'futuristic':
        return type === 'user'
          ? `${baseStyle} bg-gradient-to-r from-taxi-yellow/20 to-taxi-yellow/10 border border-taxi-yellow/30 ml-auto`
          : `${baseStyle} bg-gradient-to-r from-night-black/70 to-night-black/60 border border-zinc-700/30`;
      case 'classic':
        return type === 'user'
          ? `${baseStyle} bg-taxi-yellow/20 ml-auto`
          : `${baseStyle} bg-night-black/50`;
      case 'modern':
      default:
        return type === 'user'
          ? `${baseStyle} bg-taxi-yellow/10 border border-taxi-yellow/20 ml-auto`
          : `${baseStyle} bg-night-black/40 border border-zinc-700/20`;
    }
  };

  const getTypingAnimation = () => {
    switch (chatStyle) {
      case 'futuristic':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.3, repeat: Infinity, repeatType: 'reverse' }
        };
      case 'classic':
        return {
          initial: { opacity: 0.3 },
          animate: { opacity: 1 },
          transition: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' }
        };
      case 'modern':
      default:
        return {
          initial: { opacity: 0, y: 5 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3, repeat: Infinity, repeatType: 'reverse' }
        };
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            layout
            {...getMessageAnimation(message.type)}
            className={getMessageStyle(message.type)}
          >
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-zinc-400">
                {message.type === 'user' ? userName : 'AI CABY'}
              </span>
              <p className="text-white font-medium text-base tracking-wide">
                {message.content}
              </p>
              <span className="text-xs text-zinc-500">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            layout
            {...getTypingAnimation()}
            className={getMessageStyle('assistant')}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-taxi-yellow/50 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-taxi-yellow/50 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-taxi-yellow/50 rounded-full animate-bounce delay-200" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 