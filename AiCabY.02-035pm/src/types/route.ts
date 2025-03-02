export interface Route {
  distance: number;
  duration: number;
  polyline: string;
  geometry?: {
    type: string;
    coordinates: [number, number][];
  };
}

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface Booking {
  id: string;
  userId: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  route: Route;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  date: string;
  price: number;
  driverId?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
} 