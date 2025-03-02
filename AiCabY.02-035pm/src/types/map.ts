export interface Location {
  coordinates: [number, number];
  address: string;
}

export interface Route {
  distance: number;
  duration: number;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
}

export interface MapSelection {
  pickup: Location | null;
  dropoff: Location | null;
  route: Route | null;
}

export interface MapboxMapProps {
  selection: MapSelection;
  onLocationSelect: (type: 'pickup' | 'dropoff', location: Location) => void;
  className?: string;
} 