import React, { useState, useRef, useEffect } from 'react';
import { Car, MapPin, Camera as CameraIcon, Map as MapIcon, CreditCard as CreditCardIcon, Mic as MicrophoneIcon, Send as PaperAirplaneIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';
import ManualBookingForm from '@/components/booking/ManualBookingForm';
import { ChatMessage } from '@/components/chat/ChatMessage';
import TypingIndicator from '@/components/chat/TypingIndicator';
import { generateAIResponse } from '@/services/aiService';
import { useSpeechToText } from '@/hooks/useSpeechToText';

interface Message {
  id?: string;
  content: string | React.ReactNode;
  sender: 'user' | 'ai' | 'system';
  timestamp: string;
  type?: 'user' | 'assistant';
}

interface UserProfile {
  id: string;
  first_name: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [bookingMode, setBookingMode] = useState<'ai' | 'manual'>('ai');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    content: "Hello! How can I assist you with your journey today?",
    sender: 'ai',
    timestamp: new Date().toLocaleTimeString()
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const { isListening, transcript, startListening, stopListening } = useSpeechToText();
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);

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
          .select('id, first_name, email')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
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

  const quickActions = [
    { icon: MapPin, label: 'Location' },
    { icon: CameraIcon, label: 'Photo' },
    { icon: MapIcon, label: 'Map' },
    { icon: CreditCardIcon, label: 'Payment' }
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
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get AI response
      const response = await generateAIResponse(inputValue, {});
      const aiMessage: Message = {
        content: response.content,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        content: "I apologize, but I'm having trouble processing your request. Please try again.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
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
      
      {/* Top Bar */}
      <div className="flex items-center gap-2 p-4 border-b border-[#F7C948]/20 bg-[rgba(42,42,42,0.7)] backdrop-blur-lg">
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <Car className="w-6 h-6 text-[#F7C948]" />
        </button>
        <span className="text-xl font-bold bg-gradient-to-r from-[#F7C948] to-[#FFE17D] bg-clip-text text-transparent">AICABY</span>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-[rgba(255,255,255,0.05)] scrollbar-thumb-[rgba(247,201,72,0.3)] hover:scrollbar-thumb-[rgba(247,201,72,0.5)]">
        <div className="max-w-3xl mx-auto px-4 py-8" style={{ minHeight: 'calc(100vh - 180px)' }}>
          {/* Content Container */}
          <div className="space-y-4 mb-4 relative min-h-[60vh]">
            {/* Greeting Message - Always visible until user sends a message */}
            {bookingMode === 'ai' && !hasUserSentMessage && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <span className="text-3xl">🚕</span>
                </div>
                <h1 className="text-2xl font-medium mb-2">
                  Good {getTimeOfDay()}, {profile?.first_name || user?.email?.split('@')[0] || 'Guest'}
                </h1>
                <p className="text-zinc-400">
                  How can I assist you with your journey today?
                </p>
              </div>
            )}

            {/* Show either Manual Booking Form or Chat Messages */}
            {bookingMode === 'manual' ? (
              <ManualBookingForm 
                onComplete={async (bookingData) => {
                  try {
                    // Save booking to database
                    const { error } = await supabase
                      .from('bookings')
                      .insert([
                        {
                          user_id: user?.id,
                          pickup_location: bookingData.pickupLocation,
                          dropoff_location: bookingData.dropoffLocation,
                          distance: bookingData.distance || 0,
                          duration: bookingData.duration || 0,
                          vehicle_type: bookingData.selectedVehicle?.id,
                          payment_method: bookingData.paymentMethod,
                          is_scheduled: bookingData.isScheduled,
                          scheduled_time: bookingData.scheduledTime,
                          status: 'pending',
                          created_at: new Date().toISOString()
                        }
                      ]);

                    if (error) throw error;

                    toast.success('Booking created successfully!');
                    setBookingMode('ai');
                  } catch (error) {
                    console.error('Error creating booking:', error);
                    toast.error('Failed to create booking. Please try again.');
                  }
                }}
                onCancel={() => setBookingMode('ai')}
              />
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <ChatMessage key={message.id || index.toString()} message={{
                    id: message.id || index.toString(),
                    type: message.type || 'assistant',
                    content: typeof message.content === 'string' ? message.content : JSON.stringify(message.content),
                    timestamp: new Date(message.timestamp),
                    status: 'sent'
                  }} />
                ))}
                {isLoading && <TypingIndicator />}
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
          <div className="mb-8" style={{ display: bookingMode === 'manual' ? 'none' : 'block' }}>
            {/* Mode Selectors */}
            <div className="flex items-center gap-3 mb-3">
              <button 
                onClick={() => setBookingMode('ai')}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${bookingMode === 'ai' ? 'bg-[#F7C948] text-[#2A2A2A]' : 'bg-white/5 hover:bg-white/10'}`}
                disabled={isLoading}
              >
                AI Booking
              </button>
              <button 
                onClick={() => setBookingMode('manual')}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${bookingMode === 'manual' ? 'bg-[#F7C948] text-[#2A2A2A]' : 'bg-white/5 hover:bg-white/10'}`}
                disabled={isLoading}
              >
                Manual Booking
              </button>
            </div>

            {/* Input Field */}
            <div className="flex gap-2">
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
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-2 bg-[rgba(42,42,42,0.7)] backdrop-blur-lg rounded-lg hover:bg-white/5 transition-colors border border-[#F7C948]/20 shadow-[0_8px_32px_rgba(247,201,72,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <action.icon className="w-4 h-4 text-[#F7C948]" />
                <span className="text-xs text-[#9CA3AF]">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;