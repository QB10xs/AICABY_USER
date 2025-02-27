export interface TrainingExample {
  userInput: string;
  aiResponse: string;
  context?: {
    intent?: string;
    entities?: Record<string, string>;
    booking?: {
      pickupLocation?: string;
      dropoffLocation?: string;
      date?: string;
      time?: string;
      passengers?: number;
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