import React, { useState, useRef, useEffect } from 'react';
import { Car, MapPin, Camera as CameraIcon, Map as MapIcon, CreditCard as CreditCardIcon, Mic as MicrophoneIcon, Send as PaperAirplaneIcon, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';
import ManualBookingForm from '@/components/booking/ManualBookingForm';
import TypingIndicator from '@/components/chat/TypingIndicator';
import { generateAIResponse } from '@/services/aiService';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { Link } from 'react-router-dom';

interface Message {
  id?: string;
  content: string | React.ReactNode;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  type?: 'user' | 'assistant';
}

interface UserProfile {
  id: string;
  first_name: string;
  phone_number?: string;
  avatar_url?: string;
  payment_preferences?: string[];
  created_at: string;
  updated_at: string;
  email?: string;
}

interface ConversationContext {
  lastQuestion?: string;
  pendingLocation?: {
    address: string;
    type: 'pickup' | 'dropoff' | undefined;
  };
}

const Dashboard: React.FC = () => {
  const [bookingMode, setBookingMode] = useState<'ai' | 'manual'>('ai');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: "Hello! I'm your AICABY assistant. How can I help you with your ride today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'assistant'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const { isListening, transcript, startListening, stopListening } = useSpeechToText();
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({});

  // Helper function to get time of day
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        // Ensure all required fields are present
        const profileData: UserProfile = {
          id: data.id,
          first_name: data.first_name,
          email: data.email,
          phone_number: data.phone_number,
          avatar_url: data.avatar_url,
          payment_preferences: data.payment_preferences,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when loading state changes to false (message sent)
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  // Handle voice transcript
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (user && profile?.first_name) {
      return profile.first_name;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Guest';
  };

  // Modified quick actions with auth checks
  const quickActions = [
    { 
      icon: MapPin, 
      label: 'Location',
      requiresAuth: false,
      action: () => {
        setInputValue("I want to set my pickup location");
        inputRef.current?.focus();
      }
    },
    { 
      icon: CameraIcon, 
      label: 'Photo',
      requiresAuth: true,
      action: () => {
        if (!user) {
          toast.error('Please sign in to report issues with photos');
          return;
        }
        setInputValue("I need to report an issue with photos");
        inputRef.current?.focus();
      }
    },
    { 
      icon: MapIcon, 
      label: 'Map',
      requiresAuth: true,
      action: () => {
        if (!user) {
          toast.error('Please sign in to access route tracking');
          return;
        }
        setInputValue("Show me the route on map");
        inputRef.current?.focus();
      }
    },
    { 
      icon: CreditCardIcon, 
      label: 'Payment',
      requiresAuth: true,
      action: () => {
        if (!user) {
          toast.error('Please sign in to manage payment methods');
          return;
        }
        setInputValue("I want to manage my payment methods");
        inputRef.current?.focus();
      }
    }
  ];

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening(recognition);
      setRecognition(null);
    } else {
      const rec = startListening();
      setRecognition(rec);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    setHasUserSentMessage(true);

    // Add user message
    const userMessage: Message = {
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get AI response with context
      const response = await generateAIResponse(inputValue, conversationContext);
      
      // Update conversation context
      setConversationContext({
        lastQuestion: response.lastQuestion,
        pendingLocation: response.pendingLocation
      });

      const aiMessage: Message = {
        content: response.content,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        content: "I apologize, but I'm having trouble processing your request. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Modified handleSubmit for manual booking
  const handleManualBookingSubmit = async (bookingData: any) => {
    try {
      let bookingRecord = {
        pickup_location: bookingData.pickupLocation,
        dropoff_location: bookingData.dropoffLocation,
        distance: bookingData.distance || 0,
        duration: bookingData.duration || 0,
        vehicle_type: bookingData.selectedVehicle?.id,
        payment_method: bookingData.paymentMethod,
        is_scheduled: bookingData.isScheduled,
        scheduled_time: bookingData.scheduledTime,
        status: 'pending',
        created_at: new Date().toISOString(),
        user_reference: user?.id
      };

      if (user?.id) {
        const { error } = await supabase
          .from('bookings')
          .insert([bookingRecord])
          .select()
          .single();

        if (error) throw error;

        toast.success('Booking created successfully!');
        // Handle successful booking creation
      } else {
        // Handle guest booking
        const guestBookingRecord = {
          ...bookingRecord,
          guest_email: bookingData.email,
          guest_phone: bookingData.phoneNumber
        };

        const { error } = await supabase
          .from('bookings')
          .insert([guestBookingRecord])
          .select()
          .single();

        if (error) throw error;

        toast.success('Guest booking created successfully!');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] text-white overflow-hidden flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#2A2A2A',
            color: '#fff',
            borderRadius: '8px',
            border: '1px solid rgba(247,201,72,0.2)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#2A2A2A',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#2A2A2A',
            },
          },
        }}
      />
      
      {/* Top Bar with Sign In Button for Guests */}
      <div className="flex items-center justify-between p-4 border-b border-[#F7C948]/20 bg-[rgba(42,42,42,0.7)] backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Car className="w-6 h-6 text-[#F7C948]" />
          </button>
          <span className="text-xl font-bold bg-gradient-to-r from-[#F7C948] to-[#FFE17D] bg-clip-text text-transparent">AICABY</span>
        </div>
        {!user && (
          <Link 
            to="/signin"
            className="flex items-center gap-2 px-4 py-2 bg-[#F7C948] text-black rounded-lg hover:bg-[#FFE17D] transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span className="font-medium">Sign In</span>
          </Link>
        )}
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-[rgba(255,255,255,0.05)] scrollbar-thumb-[rgba(247,201,72,0.3)] hover:scrollbar-thumb-[rgba(247,201,72,0.5)]">
        <div className="max-w-3xl mx-auto px-4 py-8 h-full flex flex-col">
          {/* Content Container */}
          <div className={`space-y-4 mb-4 relative flex-1 ${!hasUserSentMessage ? 'flex items-center justify-center' : ''}`}>
            {/* Greeting Message - Always visible until user sends a message */}
            {bookingMode === 'ai' && !hasUserSentMessage && (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <span className="text-3xl">🚕</span>
                </div>
                <h1 className="text-2xl font-medium mb-2">
                  Good {getTimeOfDay()}, {getUserDisplayName()}
                </h1>
                <p className="text-zinc-400">
                  Start chatting to book your ride
                </p>
                {!user && (
                  <p className="mt-2 text-sm text-[#F7C948]">
                    Sign in to access additional features like ride tracking and saved payments
                  </p>
                )}
              </div>
            )}

            {/* Show either Manual Booking Form or Chat Messages */}
            {bookingMode === 'manual' ? (
              <div className="w-full">
                <button
                  onClick={() => setBookingMode('ai')}
                  className="mb-6 px-4 py-2.5 flex items-center gap-2 bg-[rgba(247,201,72,0.1)] hover:bg-[rgba(247,201,72,0.2)] 
                           text-[#F7C948] rounded-lg transition-all duration-200 border border-[#F7C948]/20
                           shadow-[0_4px_12px_rgba(247,201,72,0.1)] hover:shadow-[0_4px_16px_rgba(247,201,72,0.2)]
                           transform hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to AI Booking
                </button>
                <ManualBookingForm 
                  onComplete={handleManualBookingSubmit}
                  onCancel={() => setBookingMode('ai')}
                  isGuest={!user}
                />
              </div>
            ) : (
              <div className={`space-y-4 w-full ${hasUserSentMessage ? '' : 'hidden'}`}>
                {messages.map((message, index) => (
                  <div 
                    key={message.id || index.toString()} 
                    className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F7C948] to-[#2A2A2A] flex items-center justify-center flex-shrink-0 border border-[#F7C948]/20">
                        <span role="img" aria-label="AI Assistant" className="text-sm">🚕</span>
                      </div>
                    )}
                    <div 
                      className={`
                        max-w-[80%] rounded-2xl px-4 py-3 
                        ${message.sender === 'user' 
                          ? 'bg-gradient-to-br from-[#F7C948] to-[#2A2A2A] text-white ml-auto shadow-lg' 
                          : 'bg-[rgba(255,255,255,0.1)] border border-[#F7C948]/20'
                        }
                      `}
                    >
                      <p className={`
                        text-sm md:text-base tracking-wide
                        ${message.sender === 'user' 
                          ? 'font-bold text-white/95' 
                          : 'font-semibold text-white/90'
                        }
                      `}>{
                        typeof message.content === 'string' 
                          ? message.content 
                          : JSON.stringify(message.content)
                      }</p>
                      <span className={`
                        text-xs mt-1.5 block font-medium
                        ${message.sender === 'user' ? 'text-white/80' : 'text-[#F7C948]/80'}
                      `}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </span>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center flex-shrink-0 border border-white/10">
                        <span role="img" aria-label="User" className="text-sm">👤</span>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F7C948] to-[#2A2A2A] flex items-center justify-center flex-shrink-0 border border-[#F7C948]/20">
                      <span role="img" aria-label="AI Assistant" className="text-sm">🚕</span>
                    </div>
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-[rgba(255,255,255,0.1)] border border-[#F7C948]/20">
                      <TypingIndicator className="font-semibold text-white/90" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section - Fixed */}
      <div className="border-t border-[#F7C948]/20 bg-[rgba(42,42,42,0.7)] backdrop-blur-lg">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Input Area - Only show when in AI mode */}
          <div className="mb-0" style={{ display: bookingMode === 'manual' ? 'none' : 'block' }}>
            {/* Mode Selectors */}
            <div className="flex items-center gap-3 mb-3">
              <button 
                onClick={() => setBookingMode('ai')}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  bookingMode === 'ai' 
                    ? 'bg-gradient-to-r from-[#F7C948] to-[#FFE17D] text-[#1A1A1A] font-extrabold shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]' 
                    : 'bg-white/5 hover:bg-[rgba(247,201,72,0.1)] text-[#F7C948] font-bold border border-[#F7C948]/20'
                }`}
                style={{ color: bookingMode === 'ai' ? '#1A1A1A' : undefined }}
                disabled={isLoading}
              >
                AI Booking
              </button>
              <button 
                onClick={() => setBookingMode('manual')}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  bookingMode === 'manual' 
                    ? 'bg-[rgba(255,255,255,0.1)] text-white font-bold border-2 border-[#F7C948] shadow-[0_4px_12px_rgba(247,201,72,0.1)]' 
                    : 'bg-white/5 hover:bg-white/10 text-white/80 font-medium border border-white/10'
                }`}
                disabled={isLoading}
              >
                Manual Booking
              </button>
            </div>

            {/* Input Field */}
            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isLoading ? "Please wait for AI's response..." : "How can AICABY help you today?"}
                  className="w-full bg-white/5 rounded-lg px-4 py-3 placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#F7C948]/30 border border-[#F7C948]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <button 
                className={`p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isListening ? 'bg-[#F7C948]/20 text-[#F7C948]' : 'bg-white/5 hover:bg-white/10'}`}
                onClick={handleVoiceInput}
                disabled={isLoading}
              >
                <MicrophoneIcon className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
              </button>
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                disabled={isLoading || (action.requiresAuth && !user)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-colors border ${
                  action.requiresAuth && !user
                    ? 'bg-[rgba(42,42,42,0.5)] border-[#F7C948]/10 cursor-not-allowed'
                    : 'bg-[rgba(42,42,42,0.9)] border-[#F7C948]/20 hover:bg-[rgba(247,201,72,0.1)]'
                } disabled:opacity-50 disabled:cursor-not-allowed group`}
              >
                <action.icon className={`w-5 h-5 ${action.requiresAuth && !user ? 'text-[#F7C948]/50' : 'text-[#F7C948]'}`} />
                <span className={`text-sm font-medium ${action.requiresAuth && !user ? 'text-[#F7C948]/50' : 'text-[#F7C948]'}`}>
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;