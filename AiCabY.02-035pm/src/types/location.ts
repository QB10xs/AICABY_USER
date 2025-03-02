export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  id?: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  name?: string;
  type?: 'home' | 'work' | 'favorite' | 'other';
  lastVisited?: Date;
  frequency?: number;
} 