import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  membership_status?: 'gold' | 'silver' | 'bronze' | 'new';
  total_rides?: number;
}

import { Message } from '@/types/chat';
import { useChatStore } from '@/stores/chatStore';



const BOOKING_STYLES = [
  { id: 'quick', name: 'Quick Booking', description: 'Fast and efficient ride booking' },
  { id: 'detailed', name: 'Detailed Booking', description: 'More options and customization' },
  { id: 'schedule', name: 'Schedule Ahead', description: 'Plan future rides' },
];

const MENU_ITEMS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'rides', label: 'My Rides', icon: '🚕' },
  { id: 'saved', label: 'Saved Places', icon: '📍' },
  { id: 'wallet', label: 'Wallet', icon: '👛' },
  { id: 'support', label: 'Support', icon: '💬' },
];

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => (
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
        ${message.status === 'error' ? 'opacity-50' : ''}`}
    >
      <p className="text-sm">{message.content}</p>
      <div className="flex items-center justify-between text-[10px] mt-1 opacity-70">
        <span>
          {new Intl.DateTimeFormat('en-US', { 
            hour: 'numeric', 
            minute: 'numeric',
            hour12: true 
          }).format(message.timestamp)}
        </span>
        {message.status === 'sending' && (
          <span className="ml-2">Sending...</span>
        )}
        {message.status === 'error' && (
          <button 
            onClick={() => useChatStore.getState().retryMessage(message.id)}
            className="ml-2 text-red-500 hover:text-red-600"
          >
            Retry
          </button>
        )}
      </div>
    </div>
    {message.type === 'user' && (
      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
        <span className="text-sm text-white">👤</span>
      </div>
    )}
  </motion.div>
);

const Dashboard: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bookingMode, setBookingMode] = useState<'manual' | 'ai'>('ai');
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuthStore();
  const { messages, isTyping, addMessage, setBookingStyle } = useChatStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isChooseStyleOpen, setIsChooseStyleOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setProfile(data);
        }
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  const firstName = profile?.first_name || user?.email?.split('@')[0] || 'there';

  return (
    <Layout>
      <div className="min-h-screen bg-white relative">
        {/* Mobile Menu Panel */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-40 md:hidden"
        >
          <div className="p-4 space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-xl">🚕</span>
              </div>
              <div>
                <h3 className="font-medium text-zinc-900">{firstName}</h3>
                <p className="text-sm text-zinc-500">{profile?.membership_status || 'Member'}</p>
              </div>
            </div>

            {MENU_ITEMS.map(item => (
              <button
                key={item.id}
                className="flex items-center gap-3 w-full p-3 rounded-lg
                         hover:bg-zinc-50 text-zinc-700 transition-colors"
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 text-yellow-500">
                {/* Sun icon or your app icon */}
                <span className="text-2xl">☀️</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif mb-2">Good morning, {firstName}</h1>
            {profile?.membership_status && (
              <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                {profile.membership_status.charAt(0).toUpperCase() + profile.membership_status.slice(1)} Member
              </div>
            )}
          </motion.div>

          {/* Main Chat Interface */}
          <div className="max-w-3xl mx-auto">
            {/* Booking Mode Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex justify-center"
            >
              <div className="bg-zinc-100 p-1.5 rounded-xl inline-flex shadow-sm">
                <button
                  onClick={() => setBookingMode('ai')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    bookingMode === 'ai'
                      ? 'bg-yellow-500 text-white shadow-md'
                      : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                  }`}
                >
                  AI Assistant
                </button>
                <button
                  onClick={() => setBookingMode('manual')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    bookingMode === 'manual'
                      ? 'bg-yellow-500 text-white shadow-md'
                      : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                  }`}
                >
                  Manual Booking
                </button>
              </div>
            </motion.div>
            {bookingMode === 'ai' ? (
              <>
                {/* AI Chat Interface */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-b from-zinc-50/80 to-white backdrop-blur-xl rounded-2xl p-6 mb-4 relative overflow-hidden border border-zinc-100 shadow-lg"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/20 via-yellow-500/40 to-yellow-500/20"></div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-yellow-400 flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-zinc-900 font-semibold">AI Assistant</h3>
                        <p className="text-xs text-zinc-500">Powered by DeepSeek</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsChooseStyleOpen(!isChooseStyleOpen)}
                        className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Messages Container */}
                  <div className="space-y-6 mb-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`flex items-start gap-3 ${message.type === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                          {message.type === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-yellow-400 flex items-center justify-center shadow-md flex-shrink-0">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                          )}
                          <div className={`max-w-[80%] rounded-2xl p-4 ${message.type === 'assistant' ? 'bg-white border border-zinc-100 shadow-sm' : 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white shadow-md'}`}>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className="text-xs mt-1 opacity-60">
                              {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {message.type === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center shadow-md flex-shrink-0">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <div className="flex items-center space-x-2 p-4 bg-zinc-50/80 backdrop-blur-sm rounded-xl border border-zinc-100 shadow-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse delay-200"></div>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => setIsChooseStyleOpen(!isChooseStyleOpen)}
                      className="text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Style Chooser Dropdown */}
                    {isChooseStyleOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden border border-zinc-200">
                        {BOOKING_STYLES.map((style) => (
                          <button
                            key={style.id}
                            className="w-full p-3 text-left hover:bg-zinc-50 transition-colors
                                     border-b border-zinc-100 last:border-none"
                            onClick={() => {
                              setBookingStyle(style.id as 'quick' | 'detailed' | 'schedule');
                              setIsChooseStyleOpen(false);
                            }}
                          >
                            <div className="font-medium text-sm text-zinc-900">
                              {style.name}
                            </div>
                            <div className="text-xs text-zinc-500">{style.description}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  {messages.map(message => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-zinc-500"
                    >
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <span className="text-sm">🚕</span>
                      </div>
                      <div className="bg-white rounded-xl p-3 inline-flex gap-1">
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >•</motion.span>
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        >•</motion.span>
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        >•</motion.span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Message Input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl border border-zinc-200 p-3 mb-6"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="How can AI CABY help you today?"
                      className="flex-1 bg-transparent border-none outline-none text-zinc-800 placeholder-zinc-500"
                    />
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Quick Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-1"
                  >
                    <button className="w-full bg-yellow-500 text-white rounded-xl p-6 flex flex-col items-center gap-2 hover:bg-yellow-600 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Book Now</span>
                    </button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="col-span-1"
                  >
                    <button className="w-full bg-zinc-800 text-white rounded-xl p-6 flex flex-col items-center gap-2 hover:bg-zinc-700 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Schedule</span>
                    </button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="col-span-1"
                  >
                    <button className="w-full bg-zinc-800 text-white rounded-xl p-6 flex flex-col items-center gap-2 hover:bg-zinc-700 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Estimate</span>
                    </button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="col-span-1"
                  >
                    <button className="w-full bg-zinc-800 text-white rounded-xl p-6 flex flex-col items-center gap-2 hover:bg-zinc-700 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Places</span>
                    </button>
                  </motion.div>
                </div>

                {/* Recent/Saved Locations */}
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-zinc-800 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-zinc-700 transition-colors"
                  >
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">Airport Transfer</h3>
                      <p className="text-zinc-400 text-sm">JFK International Airport</p>
                    </div>
                    <button className="p-2 hover:bg-zinc-600 rounded-full">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-zinc-800 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-zinc-700 transition-colors"
                  >
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">Home → Office</h3>
                      <p className="text-zinc-400 text-sm">Daily Commute</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-zinc-800 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-zinc-700 transition-colors"
                  >
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">Central Park</h3>
                      <p className="text-zinc-400 text-sm">Added to favorites</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Message Input - Only show in AI mode */}
            {bookingMode === 'ai' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl border border-zinc-200 shadow-lg p-4 mb-6 relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-500/20 via-yellow-500/40 to-yellow-500/20"></div>
                <div className="flex items-center gap-3">
                  <button className="p-2.5 hover:bg-yellow-50 rounded-lg transition-all group">
                    <svg className="w-5 h-5 text-zinc-400 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2.5 bg-zinc-50 rounded-xl border border-zinc-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none text-zinc-800 placeholder-zinc-400 transition-all"
                      onKeyPress={async (e) => {
                        if (e.key === 'Enter' && newMessage.trim()) {
                          await addMessage({
                            type: 'user',
                            content: newMessage.trim(),
                          });
                          setNewMessage('');
                        }
                      }}
                    />
                  </div>
                  <button 
                    className={`p-2.5 rounded-lg transition-all ${
                      newMessage.trim() 
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-md' 
                        : 'bg-zinc-100 text-zinc-400'
                    }`}
                    disabled={!newMessage.trim()}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
              </div>
            </motion.div>
            )}

            {/* Action Cards - Only show in AI mode */}
            {bookingMode === 'ai' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 md:space-y-2"
              >
                <ActionCard
                  title="Quick Booking"
                  description="Book a ride in seconds using your frequent routes"
                />
                <ActionCard
                  title="Schedule Future Rides"
                  description="Plan ahead and schedule your upcoming trips"
                />
                <ActionCard
                  title="View Recent Activities"
                  description="Check your ride history and saved locations"
                />
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
};



// Action Card Component
interface ActionCardProps {
  title: string;
  description: string;
  onClick?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    className="p-4 rounded-xl bg-white border border-zinc-200 cursor-pointer
              hover:border-yellow-500/20 hover:bg-yellow-50/50 transition-colors"
    onClick={onClick}
  >
    <h3 className="font-medium text-zinc-900 mb-1">{title}</h3>
    <p className="text-sm text-zinc-600">{description}</p>
  </motion.div>
);

export default Dashboard; 