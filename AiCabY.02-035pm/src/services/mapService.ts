import { Location, Route } from '@/types/map';

const MAPBOX_API_URL = 'https://api.mapbox.com';
const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export const getRoute = async (pickup: Location, dropoff: Location): Promise<Route> => {
  const coordinates = `${pickup.coordinates[0]},${pickup.coordinates[1]};${dropoff.coordinates[0]},${dropoff.coordinates[1]}`;
  const url = `${MAPBOX_API_URL}/directions/v5/mapbox/driving/${coordinates}?access_token=${ACCESS_TOKEN}&geometries=geojson&overview=full`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch route');
    }

    const data = await response.json();
    const route = data.routes[0];

    return {
      distance: route.distance,
      duration: route.duration,
      geometry: route.geometry,
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    throw error;
  }
};

export const searchLocation = async (query: string): Promise<Location[]> => {
  const url = `${MAPBOX_API_URL}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${ACCESS_TOKEN}&country=NL&types=address,poi&language=nl`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    const data = await response.json();
    return data.features.map((feature: any) => ({
      address: feature.place_name,
      coordinates: feature.center,
      placeId: feature.id,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
};

export const estimatePrice = (distance: number): number => {
  // Base fare + price per km (simple estimation)
  const baseFare = 2.95;
  const pricePerKm = 2.35;
  const distanceInKm = distance / 1000;
  
  return Number((baseFare + (distanceInKm * pricePerKm)).toFixed(2));
}; 