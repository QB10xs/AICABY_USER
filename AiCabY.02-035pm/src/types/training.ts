export interface TrainingExample {
  userInput: string;
  aiResponse: string;
  intent: string;
  entities: Record<string, any>;
  context?: {
    booking?: any;
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