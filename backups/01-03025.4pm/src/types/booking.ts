export type BookingStatus = 'pending' | 'accepted' | 'completed' | 'cancelled' | 'confirmed';

export interface Booking {
  id: string;
  userId: string;
  pickupLocation: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    name?: string;
  };
  dropoffLocation: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    name?: string;
  };
  route: {
    distance: number;
    duration: number;
    polyline: string;
    geometry?: {
      type: string;
      coordinates: [number, number][];
    };
  } | null;
  status: BookingStatus;
  date: string;
  time?: string;
  price: number;
  estimatedPrice?: number;
  driverId?: string;
  rating?: number;
  passengers: number;
  vehicleType?: string;
  additionalServices?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CarCategory = 'Standard' | 'Comfort' | 'Lux' | 'TaxiBus';

export interface CarCategoryDetails {
  id: CarCategory;
  name: string;
  description: string;
  basePrice: number;
  pricePerKm: number;
  capacity: number;
  image: string;
}

export const CAR_CATEGORIES: Record<CarCategory, CarCategoryDetails> = {
  Standard: {
    id: 'Standard',
    name: 'Standard',
    description: 'Comfortable and economical',
    basePrice: 2.95,
    pricePerKm: 2.35,
    capacity: 4,
    image: '/cars/standard.png'
  },
  Comfort: {
    id: 'Comfort',
    name: 'Comfort',
    description: 'Extra comfort and space',
    basePrice: 3.95,
    pricePerKm: 2.85,
    capacity: 4,
    image: '/cars/comfort.png'
  },
  Lux: {
    id: 'Lux',
    name: 'Lux',
    description: 'Premium luxury experience',
    basePrice: 4.95,
    pricePerKm: 3.45,
    capacity: 4,
    image: '/cars/lux.png'
  },
  TaxiBus: {
    id: 'TaxiBus',
    name: 'Taxi Bus',
    description: 'Perfect for groups',
    basePrice: 5.95,
    pricePerKm: 3.95,
    capacity: 8,
    image: '/cars/taxibus.png'
  }
}; 