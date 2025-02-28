export interface Route {
  id?: string;
  distance: number; // in meters
  duration: number; // in seconds
  geometry: {
    type: 'LineString';
    coordinates: [number, number][]; // [longitude, latitude] pairs
  };
  legs?: {
    distance: number;
    duration: number;
    steps: {
      distance: number;
      duration: number;
      instruction: string;
      name: string;
    }[];
  }[];
} 