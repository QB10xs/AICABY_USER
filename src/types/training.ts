import { Booking } from './booking';

export interface TrainingExample {
  userInput: string;
  aiResponse: string;
  context?: {
    intent?: string;
    entities?: Record<string, string>;
    booking?: Partial<Booking>;
    lastQuestion?: string;
    pendingLocation?: {
      address: string;
      type: 'pickup' | 'dropoff' | undefined;
    };
  };
}

export interface TrainingData {
  examples: TrainingExample[];
  metadata: {
    version: string;
    lastUpdated: string;
    totalExamples: number;
  };
} 