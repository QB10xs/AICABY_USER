import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapboxMapProps } from '@/types/map';

// Initialize Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapboxMap: React.FC<MapboxMapProps> = ({
  selection,
  className = '',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const pickupMarker = useRef<mapboxgl.Marker | null>(null);
  const dropoffMarker = useRef<mapboxgl.Marker | null>(null);
  const routeLine = useRef<mapboxgl.GeoJSONSource | null>(null);

  // Default to Amsterdam coordinates
  const [lng] = useState(4.9041);
  const [lat] = useState(52.3676);
  const [zoom] = useState(11);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add route layer
    map.current.on('load', () => {
      map.current?.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        },
      });

      map.current?.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#FFD700',
          'line-width': 4,
        },
      });

      routeLine.current = map.current?.getSource('route') as mapboxgl.GeoJSONSource;
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers and route when selection changes
  useEffect(() => {
    if (!map.current) return;

    // Update pickup marker
    if (selection.pickup) {
      if (pickupMarker.current) {
        pickupMarker.current.remove();
      }
      pickupMarker.current = new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat(selection.pickup.coordinates)
        .addTo(map.current);
    }

    // Update dropoff marker
    if (selection.dropoff) {
      if (dropoffMarker.current) {
        dropoffMarker.current.remove();
      }
      dropoffMarker.current = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat(selection.dropoff.coordinates)
        .addTo(map.current);
    }

    // Update route and fit bounds
    if (selection.pickup && selection.dropoff) {
      const bounds = new mapboxgl.LngLatBounds()
        .extend(selection.pickup.coordinates)
        .extend(selection.dropoff.coordinates);
      
      map.current.fitBounds(bounds, {
        padding: 100,
        duration: 1000,
      });
    }

    // Update route line if available
    if (selection.route && routeLine.current) {
      routeLine.current.setData({
        type: 'Feature',
        properties: {},
        geometry: selection.route.geometry,
      });
    }
  }, [selection]);

  return (
    <div ref={mapContainer} className={`h-[400px] ${className || ''}`} />
  );
};

export default MapboxMap; 