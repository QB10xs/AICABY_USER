export interface WeatherData {
  condition: 'rain' | 'snow' | 'sunny' | 'storm';
  temperature: number;
  description: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  type: 'home' | 'work' | 'favorite' | 'recent';
  lastVisited?: Date;
  frequency?: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface TimeContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  isRushHour: boolean;
  isLunchTime: boolean;
  isWeekend: boolean;
}

export interface UserPreferences {
  preferredVehicleType: string;
  favoriteLocations: Location[];
  commonSchedule: {
    [key: string]: {
      time: string;
      location: Location;
    }[];
  };
  weatherPreferences: {
    rainBehavior: 'wait' | 'proceed';
    temperatureThresholds: {
      min: number;
      max: number;
    };
  };
} 