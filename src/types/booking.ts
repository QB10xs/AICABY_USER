import { Location } from './location';
import { Route } from './route';

export interface Booking {
  id: string;
  userId: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  route: Route | null;
  date: string;
  time: string;
  passengers: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price: number;
  createdAt: Date;
  updatedAt: Date;
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