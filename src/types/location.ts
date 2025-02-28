export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  id?: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  type?: 'home' | 'work' | 'favorite' | 'other';
  lastVisited?: Date;
  frequency?: number;
} 