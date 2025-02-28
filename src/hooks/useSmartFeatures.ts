import { useState, useEffect } from 'react';
import { smartSuggestionsService } from '@/services/smartSuggestions';
import type { SmartSuggestion, WeatherData, Location } from '@/types/smart';

export function useSmartFeatures() {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock weather data for development
  const mockWeather: WeatherData = {
    condition: 'sunny',
    temperature: 22,
    description: 'Clear sky',
    feelsLike: 23,
    humidity: 60,
    windSpeed: 5,
    precipitation: 0
  };

  // Mock recent places for development
  const mockRecentPlaces: Location[] = [
    {
      id: '1',
      name: 'Work',
      address: '123 Business St',
      coordinates: { lat: 52.5200, lng: 13.4050 },
      type: 'work',
      lastVisited: new Date(),
      frequency: 5
    },
    {
      id: '2',
      name: 'Home',
      address: '456 Home Ave',
      coordinates: { lat: 52.5200, lng: 13.4050 },
      type: 'home',
      lastVisited: new Date(),
      frequency: 10
    }
  ];

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setIsLoading(true);
        
        // In production, we would fetch real weather data here
        const weatherData = mockWeather;
        setWeather(weatherData);

        // Get suggestions based on current context
        const newSuggestions = await smartSuggestionsService.getSuggestions({
          weather: weatherData,
          recentPlaces: mockRecentPlaces
        });

        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Error loading smart features:', error);
        // Set default suggestions if there's an error
        setSuggestions([{
          type: 'time',
          priority: 1,
          context: {
            timeOfDay: String(new Date().getHours()),
            recentPlaces: []
          },
          suggestion: {
            text: "How can I assist you with your journey?",
            action: () => {},
            icon: "🚕"
          }
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
    
    // Refresh suggestions every 5 minutes
    const interval = setInterval(loadSuggestions, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    suggestions,
    weather,
    isLoading,
    refreshSuggestions: () => {
      setSuggestions([]); // Clear current suggestions
      setIsLoading(true); // Show loading state
    }
  };
}

export default useSmartFeatures;
