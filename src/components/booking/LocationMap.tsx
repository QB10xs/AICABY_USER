import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Location } from '@/types/location';

// Initialize Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface LocationMapProps {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  onPickupSelect?: (location: Location) => void;
  onDropoffSelect?: (location: Location) => void;
  className?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({
  pickupLocation,
  dropoffLocation,

  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [routeLayer, setRouteLayer] = useState<string | null>(null);
  const [isLoading] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.5, 40], // Default center
      zoom: 12,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true
    }), 'top-right');

    // Add user location control
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }), 'top-right');

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers and route when locations change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    const markers = document.getElementsByClassName('marker');
    while (markers[0]) {
      markers[0].remove();
    }

    // Add pickup marker
    if (pickupLocation?.coordinates) {
      const pickupMarker = document.createElement('div');
      pickupMarker.className = 'marker pickup-marker';
      pickupMarker.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-[#F7C948]/20 flex items-center justify-center transform-gpu transition-transform duration-300 hover:scale-110">
          <div class="w-5 h-5 text-[#F7C948] animate-bounce">📍</div>
        </div>
      `;

      new mapboxgl.Marker(pickupMarker)
        .setLngLat([pickupLocation.coordinates.lng, pickupLocation.coordinates.lat])
        .addTo(map.current);
    }

    // Add dropoff marker
    if (dropoffLocation?.coordinates) {
      const dropoffMarker = document.createElement('div');
      dropoffMarker.className = 'marker dropoff-marker';
      dropoffMarker.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center transform-gpu transition-transform duration-300 hover:scale-110">
          <div class="w-5 h-5 text-green-500 animate-bounce">🏁</div>
        </div>
      `;

      new mapboxgl.Marker(dropoffMarker)
        .setLngLat([dropoffLocation.coordinates.lng, dropoffLocation.coordinates.lat])
        .addTo(map.current);
    }

    // Draw route if both locations are set
    if (pickupLocation?.coordinates && dropoffLocation?.coordinates) {
      // Remove existing route
      if (routeLayer) {
        map.current.removeLayer(routeLayer);
        map.current.removeSource(routeLayer);
      }

      // Get route from Mapbox Directions API
      fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/` +
        `${pickupLocation.coordinates.lng},${pickupLocation.coordinates.lat};` +
        `${dropoffLocation.coordinates.lng},${dropoffLocation.coordinates.lat}` +
        `?geometries=geojson&access_token=${mapboxgl.accessToken}`
      )
        .then(response => response.json())
        .then(data => {
          if (!map.current || !data.routes[0]) return;

          const route = data.routes[0].geometry;
          const routeId = `route-${Date.now()}`;

          map.current.addSource(routeId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route
            }
          });

          map.current.addLayer({
            id: routeId,
            type: 'line',
            source: routeId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#F7C948',
              'line-width': 4,
              'line-opacity': 0.8
            }
          });

          setRouteLayer(routeId);

          // Fit map to show entire route
          const coordinates = route.coordinates;
          const bounds = coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: number[]) => {
            return bounds.extend(coord as [number, number]);
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

          map.current.fitBounds(bounds, {
            padding: 50
          });
        });
    }
  }, [pickupLocation, dropoffLocation]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div 
        ref={mapContainer} 
        className="w-full h-full min-h-[400px] rounded-xl border border-[#F7C948]/10 bg-zinc-900/90 overflow-hidden shadow-lg" 
        style={{ minHeight: '400px' }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#F7C948] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default LocationMap; 