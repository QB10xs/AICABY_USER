import React, { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';
import Header from './Header';
import GreetingSection from './GreetingSection';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import MessageList from './MessageList';
import ChatModeSelector, { ChatMode, ChatStyle, chatModes, chatStyles } from './ChatModeSelector';
import { smartSuggestionsService } from '../../services/smartSuggestions';
import type { SmartSuggestion } from '../../services/smartSuggestions';
import type { WeatherData, Location } from '../../types/smart';

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const session = useSession();
  const userName = session?.user?.user_metadata?.full_name || 'Guest';
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [selectedMode, setSelectedMode] = useState<ChatMode>(chatModes[0]);
  const [selectedStyle, setSelectedStyle] = useState<ChatStyle>(chatStyles[0]);

  // Mock weather data for testing
  const mockWeather: WeatherData = {
    condition: 'sunny',
    temperature: 22,
    description: 'Clear sky',
    feelsLike: 23,
    humidity: 60,
    windSpeed: 5
  };

  // Mock recent places for testing
  const mockRecentPlaces: Location[] = [
    {
      id: '1',
      name: 'Work',
      address: '123 Business St',
      coordinates: { latitude: 52.5200, longitude: 13.4050 },
      type: 'work',
      lastVisited: new Date(),
      frequency: 5
    },
    {
      id: '2',
      name: 'Home',
      address: '456 Home Ave',
      coordinates: { latitude: 52.5200, longitude: 13.4050 },
      type: 'home',
      lastVisited: new Date(),
      frequency: 10
    }
  ];

  // Initialize suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      const newSuggestions = await smartSuggestionsService.getSuggestions({
        weather: mockWeather,
        recentPlaces: mockRecentPlaces
      });
      
      setSuggestions(newSuggestions);
      
      // Set initial greeting based on top suggestion
      if (newSuggestions.length > 0) {
        setMessages([{
          id: '1',
          type: 'assistant',
          content: newSuggestions[0].suggestion.text,
          timestamp: new Date(),
        }]);
      }
    };

    loadSuggestions();
  }, []);

  const simulateAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));

    let response = "I'm processing your request...";

    // Enhanced response logic using suggestions
    if (userMessage.toLowerCase().includes('book')) {
      const timeBasedSuggestion = suggestions.find(s => s.type === 'time');
      if (timeBasedSuggestion && timeBasedSuggestion.context.timeOfDay === 'morning') {
        response = "I notice it's your usual commute time. Would you like me to book your regular ride to work?";
      } else {
        response = "I can help you book a ride. Would you like to proceed with manual booking or let me assist you?";
      }
    } else if (userMessage.toLowerCase().includes('weather')) {
      const weatherSuggestion = suggestions.find(s => s.type === 'weather');
      if (weatherSuggestion) {
        response = weatherSuggestion.suggestion.text;
      }
    } else if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      const topSuggestion = suggestions[0];
      response = `Hello! ${topSuggestion ? topSuggestion.suggestion.text : 'How can I help you today?'}`;
    } else if (userMessage.toLowerCase().includes('location')) {
      response = "I can help you with location services. Would you like to set your pickup location or check popular destinations?";
    }

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
    }]);
    setIsTyping(false);
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

  const handleQuickAction = (action: string) => {
    switch (action) {
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
    <div className="flex flex-col h-screen bg-gradient-to-b from-night-black to-black">
      {/* Fixed Header with gradient fade */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-night-black via-night-black/95 to-transparent pb-6">
        <div className="mx-auto w-full max-w-7xl p-4">
          <Header />
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full flex flex-col mx-auto w-full max-w-7xl">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
            <div className="space-y-6 min-h-full pb-4">
              <GreetingSection userName={userName} />
              <div className="max-w-xl mx-auto">
                <ChatModeSelector
                  selectedMode={selectedMode}
                  selectedStyle={selectedStyle}
                  onModeChange={handleModeChange}
                  onStyleChange={handleStyleChange}
                />
              </div>
              <MessageList 
                messages={messages} 
                isTyping={isTyping}
                chatStyle={selectedStyle.id}
              />
            </div>
          </div>

          {/* Fixed Bottom Section */}
          <div className="mt-auto px-4 pb-4 space-y-6 bg-gradient-to-t from-black via-black/95 to-transparent pt-6">
            <div className="glass-card p-4">
              <ChatInput onSend={handleSendMessage} />
            </div>
            <QuickActions onAction={handleQuickAction} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatInterface; 