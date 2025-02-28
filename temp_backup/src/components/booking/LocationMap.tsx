import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPin } from 'lucide-react';
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
  onPickupSelect,
  onDropoffSelect,
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [routeLayer, setRouteLayer] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.5, 40], // Default center
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

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
        <div class="w-8 h-8 rounded-full bg-taxi-yellow/20 flex items-center justify-center">
          <div class="w-4 h-4 text-taxi-yellow">📍</div>
        </div>
      `;

      new mapboxgl.Marker(pickupMarker)
        .setLngLat([pickupLocation.coordinates.longitude, pickupLocation.coordinates.latitude])
        .addTo(map.current);
    }

    // Add dropoff marker
    if (dropoffLocation?.coordinates) {
      const dropoffMarker = document.createElement('div');
      dropoffMarker.className = 'marker dropoff-marker';
      dropoffMarker.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
          <div class="w-4 h-4 text-success">📍</div>
        </div>
      `;

      new mapboxgl.Marker(dropoffMarker)
        .setLngLat([dropoffLocation.coordinates.longitude, dropoffLocation.coordinates.latitude])
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
        `${pickupLocation.coordinates.longitude},${pickupLocation.coordinates.latitude};` +
        `${dropoffLocation.coordinates.longitude},${dropoffLocation.coordinates.latitude}` +
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
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
    </div>
  );
};

export default LocationMap; 