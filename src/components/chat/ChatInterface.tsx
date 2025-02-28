import React, { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';
import Header from './Header';
import GreetingSection from './GreetingSection';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import MessageList from './MessageList';
import ChatModeSelector, { ChatMode, ChatStyle, chatModes, chatStyles } from './ChatModeSelector';
import SmartSuggestions from './SmartSuggestions';
import { GlassCard } from '@/components/ui/GlassCard';
import { useSmartFeatures } from '@/hooks/useSmartFeatures';
import type { Message } from '@/types/chat';

import BookingModeToggle from '../booking/BookingModeToggle';
import ManualBookingForm from '../booking/ManualBookingForm';

const ChatInterface: React.FC = () => {
  const [bookingMode, setBookingMode] = useState<'ai' | 'manual'>('ai');
  const session = useSession();
  const userName = session?.user?.user_metadata?.full_name || 'Guest';
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ChatMode>(chatModes[0]);
  const [selectedStyle, setSelectedStyle] = useState<ChatStyle>(chatStyles[0]);
  
  const { suggestions, weather, refreshSuggestions } = useSmartFeatures();

  // Set initial greeting when suggestions are loaded
  useEffect(() => {
    if (suggestions.length > 0 && messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'assistant',
        content: suggestions[0].suggestion.text,
        timestamp: new Date(),
      }]);
    }
  }, [suggestions, messages.length]);

  const simulateAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));

    let response = "I'm processing your request...";
    const lowerMessage = userMessage.toLowerCase();

    // Enhanced response logic using context
    if (lowerMessage.includes('book')) {
      const timeBasedSuggestion = suggestions.find(s => s.type === 'time');
      if (timeBasedSuggestion) {
        response = timeBasedSuggestion.suggestion.text;
      } else {
        response = "I can help you book a ride. Would you like to proceed with manual booking or let me assist you?";
      }
    } else if (lowerMessage.includes('weather') && weather) {
      response = `Current weather is ${weather.description} with a temperature of ${weather.temperature}°C. ${weather.condition === 'sunny' ? 'Perfect weather for a ride!' : 'I recommend booking a ride to stay comfortable.'}`;
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      const topSuggestion = suggestions[0];
      response = `Hello! ${topSuggestion ? topSuggestion.suggestion.text : 'How can I help you today?'}`;
    } else if (lowerMessage.includes('location')) {
      response = "I can help you with location services. Would you like to set your pickup location or check popular destinations?";
    }

    // Add AI response
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
    }]);
    setIsTyping(false);

    // Refresh suggestions after each interaction
    refreshSuggestions();
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    await simulateAIResponse(content);
  };

  const handleQuickAction = (action: { id: string; label: string }) => {
    switch (action.id) {
      case 'location':
        toast.success('Opening location selector...');
        break;
      case 'photo':
        toast.success('Opening camera...');
        break;
      case 'map':
        toast.success('Opening map view...');
        break;
      case 'payment':
        toast.success('Opening payment options...');
        break;
      default:
        break;
    }
  };

  const handleModeChange = (mode: ChatMode) => {
    setSelectedMode(mode);
    toast.success(`Switched to ${mode.name} mode`);
    
    // Add a system message to indicate mode change
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'assistant',
      content: `Switched to ${mode.name} mode. ${mode.description}`,
      timestamp: new Date(),
    }]);
  };

  const handleStyleChange = (style: ChatStyle) => {
    setSelectedStyle(style);
    toast.success(`Applied ${style.name} style`);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-taxi-black to-black">
      {/* Fixed Header with gradient fade */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-taxi-black via-taxi-black/95 to-transparent pb-6 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl p-4">
          <Header />
          <BookingModeToggle
            mode={bookingMode}
            onModeChange={setBookingMode}
          />
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full flex flex-col mx-auto w-full max-w-7xl">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
            <div className="space-y-6 min-h-full pb-4">
              <GreetingSection userName={userName} />
              {bookingMode === 'manual' ? (
                <ManualBookingForm
                  onComplete={(_bookingData) => {
                    toast.success('Booking submitted successfully!');
                    setBookingMode('ai');
                    // Add booking confirmation message
                    setMessages(prev => [...prev, {
                      id: Date.now().toString(),
                      type: 'assistant',
                      content: `Booking confirmed! Your taxi has been scheduled.`,
                      timestamp: new Date(),
                      status: 'sent'
                    }]);
                  }}
                  onCancel={() => setBookingMode('ai')}
                />
              ) : (
                <div className="max-w-xl mx-auto space-y-6">
                <GlassCard className="p-4" gradient>
                  <ChatModeSelector
                    selectedMode={selectedMode}
                    selectedStyle={selectedStyle}
                    onModeChange={handleModeChange}
                    onStyleChange={handleStyleChange}
                  />
                </GlassCard>
                <SmartSuggestions 
                  suggestions={suggestions}
                  onSuggestionClick={async (suggestion) => {
                    if (suggestion.suggestion.action) {
                      suggestion.suggestion.action();
                    }
                    await handleSendMessage(suggestion.suggestion.text);
                  }}
                />
              </div>
              )}
              <MessageList 
                messages={messages} 
                isTyping={isTyping}
                chatStyle={selectedStyle.id as 'modern' | 'classic' | 'futuristic'}
              />
            </div>
          </div>

          {/* Fixed Bottom Section */}
          {bookingMode === 'ai' && (
            <div className="mt-auto px-4 pb-4 space-y-6 bg-gradient-to-t from-black via-black/95 to-transparent pt-6 backdrop-blur-md">
              <GlassCard className="p-4" interactive>
                <ChatInput onSend={handleSendMessage} />
              </GlassCard>
              <QuickActions onAction={handleQuickAction} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatInterface; 