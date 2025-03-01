import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface MapViewProps {
  driverLocation?: {
    latitude: number;
    longitude: number;
  };
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  onClose: () => void;
}

const MapView: React.FC<MapViewProps> = ({
  driverLocation,
  userLocation,
  onClose
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v10',
        center: driverLocation 
          ? [driverLocation.longitude, driverLocation.latitude]
          : [-74.006, 40.7128] as [number, number],
        zoom: 12
      });

      if (driverLocation) {
        new mapboxgl.Marker({ color: '#F7C948' })
          .setLngLat([driverLocation.longitude, driverLocation.latitude])
          .addTo(map.current);
      }

      if (userLocation) {
        new mapboxgl.Marker({ color: '#4CAF50' })
          .setLngLat([userLocation.longitude, userLocation.latitude])
          .addTo(map.current);
      }

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load map');
      setIsLoading(false);
    }

    return () => {
      map.current?.remove();
    };
  }, [driverLocation, userLocation]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[80vh] bg-[#1A1A1A] rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[#2A2A2A] rounded-full hover:bg-[#3A3A3A] transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F7C948]"></div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A]">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
};

export default MapView; 