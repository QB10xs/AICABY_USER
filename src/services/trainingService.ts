import { TrainingData, TrainingExample } from '@/types/training';

class TrainingService {
  private trainingData: TrainingData = {
    examples: [],
    metadata: {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      totalExamples: 0,
    },
  };

  // Load training data from a JSON file or API
  async loadTrainingData(data: TrainingData) {
    this.trainingData = {
      ...data,
      metadata: {
        ...data.metadata,
        lastUpdated: new Date().toISOString(),
      },
    };
    console.log(`Loaded ${this.trainingData.examples.length} training examples`);
  }

  // Find the most relevant example for a given input
  findMatchingExample(input: string): TrainingExample | null {
    const normalizedInput = input.toLowerCase().trim();
    
    // Simple matching algorithm - can be improved with more sophisticated matching
    const match = this.trainingData.examples.find(example => {
      const exampleInput = example.userInput.toLowerCase();
      return (
        normalizedInput.includes(exampleInput) ||
        exampleInput.includes(normalizedInput) ||
        this.calculateSimilarity(normalizedInput, exampleInput) > 0.7
      );
    });

    return match || null;
  }

  // Add a new training example
  addExample(example: TrainingExample) {
    this.trainingData.examples.push(example);
    this.trainingData.metadata.totalExamples = this.trainingData.examples.length;
    this.trainingData.metadata.lastUpdated = new Date().toISOString();
  }

  // Get all training examples
  getExamples(): TrainingExample[] {
    return this.trainingData.examples;
  }

  // Calculate similarity between two strings (simple Jaccard similarity)
  private calculateSimilarity(str1: string, str2: string): number {
    const set1 = new Set(str1.split(' '));
    const set2 = new Set(str2.split(' '));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }
}

export const trainingService = new TrainingService(); 