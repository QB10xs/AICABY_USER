import { WeatherData, Location, Coordinates } from '../types/smart';

export interface SmartSuggestion {
  type: 'weather' | 'time' | 'location' | 'preference';
  priority: number;
  context: {
    timeOfDay: string;
    weather?: WeatherData;
    userLocation?: Coordinates;
    recentPlaces?: Location[];
  };
  suggestion: {
    text: string;
    action: () => void;
    icon: string;
  };
}

export interface WeatherSuggestion {
  condition: 'rain' | 'snow' | 'sunny' | 'storm';
  message: string;
  recommendations: {
    vehicleType: string;
    route: string;
    timing: string;
  };
}

class SmartSuggestionsService {
  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  private isRushHour(): boolean {
    const hour = new Date().getHours();
    return (hour >= 6 && hour <= 9) || (hour >= 16 && hour <= 19);
  }

  private isLunchTime(): boolean {
    const hour = new Date().getHours();
    return hour >= 11 && hour <= 14;
  }

  public getTimeSuggestion(recentPlaces: Location[] = []): SmartSuggestion {
    const timeOfDay = this.getTimeOfDay();
    let suggestion: SmartSuggestion = {
      type: 'time',
      priority: 1,
      context: {
        timeOfDay,
        recentPlaces
      },
      suggestion: {
        text: "How can I assist you with your journey?",
        action: () => {},
        icon: "🚕"
      }
    };

    if (this.isRushHour()) {
      const isMorning = timeOfDay === 'morning';
      suggestion = {
        ...suggestion,
        priority: 3,
        suggestion: {
          text: isMorning 
            ? "Beat the traffic! Would you like to book your work commute?"
            : "Ready to head home? I can help you avoid traffic.",
          action: () => {},
          icon: isMorning ? "🌅" : "🌆"
        }
      };
    } else if (this.isLunchTime()) {
      suggestion = {
        ...suggestion,
        priority: 2,
        suggestion: {
          text: "Lunch break? I can help you find and book a ride to nearby restaurants.",
          action: () => {},
          icon: "🍜"
        }
      };
    }

    return suggestion;
  }

  public getWeatherSuggestion(weather: WeatherData): WeatherSuggestion {
    const suggestions: Record<string, WeatherSuggestion> = {
      rain: {
        condition: 'rain',
        message: "It's raining! Let me help you stay dry with door-to-door service.",
        recommendations: {
          vehicleType: 'sedan',
          route: 'optimal_covered',
          timing: 'immediate'
        }
      },
      snow: {
        condition: 'snow',
        message: "Snowy conditions detected. I'll ensure you get a winter-ready vehicle.",
        recommendations: {
          vehicleType: 'suv',
          route: 'safe_winter',
          timing: 'flexible'
        }
      },
      storm: {
        condition: 'storm',
        message: "Severe weather alert! Let's plan your ride carefully.",
        recommendations: {
          vehicleType: 'suv',
          route: 'safe_main',
          timing: 'wait_out'
        }
      },
      sunny: {
        condition: 'sunny',
        message: "It's a beautiful day! Regular service available with no weather delays.",
        recommendations: {
          vehicleType: 'any',
          route: 'optimal',
          timing: 'standard'
        }
      }
    };

    return suggestions[weather.condition] || suggestions.sunny;
  }

  public async getSuggestions(context: {
    weather?: WeatherData;
    userLocation?: Coordinates;
    recentPlaces?: Location[];
  }): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];
    
    // Add time-based suggestion
    suggestions.push(this.getTimeSuggestion(context.recentPlaces));

    // Add weather-based suggestion if weather data is available
    if (context.weather) {
      const weatherSuggestion = this.getWeatherSuggestion(context.weather);
      suggestions.push({
        type: 'weather',
        priority: weatherSuggestion.condition === 'sunny' ? 1 : 4,
        context: {
          timeOfDay: this.getTimeOfDay(),
          weather: context.weather
        },
        suggestion: {
          text: weatherSuggestion.message,
          action: () => {},
          icon: this.getWeatherIcon(weatherSuggestion.condition)
        }
      });
    }

    // Sort suggestions by priority (higher number = higher priority)
    return suggestions.sort((a, b) => b.priority - a.priority);
  }

  private getWeatherIcon(condition: string): string {
    const icons: Record<string, string> = {
      rain: '🌧️',
      snow: '🌨️',
      storm: '⛈️',
      sunny: '☀️'
    };
    return icons[condition] || '🌤️';
  }
}

export const smartSuggestionsService = new SmartSuggestionsService(); 