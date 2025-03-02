import { TrainingData, TrainingExample } from '@/types/training';
import { supabaseTrainingService } from './supabaseTrainingService';

class TrainingService {
  private trainingData: TrainingData = {
    examples: [],
    metadata: {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      totalExamples: 0,
    },
  };

  // Load training data from Supabase
  async loadTrainingData(initialData?: TrainingData) {
    try {
      if (initialData) {
        console.log('Initial data provided, attempting to upload to Supabase...');
        try {
          // Try to upload initial data to Supabase
          await supabaseTrainingService.bulkInsertExamples(initialData.examples);
          console.log('Successfully uploaded initial data to Supabase');
        } catch (uploadError) {
          console.error('Error uploading initial data to Supabase:', uploadError);
        }
      }

      // Always try to fetch from Supabase
      console.log('Fetching data from Supabase...');
      this.trainingData = await supabaseTrainingService.fetchTrainingData();
      console.log(`Loaded ${this.trainingData.examples.length} training examples from Supabase`);
    } catch (error) {
      console.error('Error loading training data:', error);
      if (initialData) {
        console.log('Using provided initial data as fallback');
        this.trainingData = {
          ...initialData,
          metadata: {
            ...initialData.metadata,
            lastUpdated: new Date().toISOString(),
          },
        };
      }
      throw error;
    }
  }

  // Find a matching example based on user input
  findMatchingExample(userInput: string): TrainingExample | null {
    const normalizedInput = userInput.toLowerCase().trim();
    let bestMatch: TrainingExample | null = null;
    let highestSimilarity = 0;

    for (const example of this.trainingData.examples) {
      const similarity = this.calculateSimilarity(
        normalizedInput,
        example.userInput.toLowerCase()
      );

      if (similarity > highestSimilarity && similarity > 0.5) {
        highestSimilarity = similarity;
        bestMatch = example;
      }
    }

    return bestMatch;
  }

  // Add a new training example
  async addExample(example: TrainingExample) {
    try {
      await supabaseTrainingService.addTrainingExample(example);
      // Refresh local data
      await this.loadTrainingData();
    } catch (error) {
      console.error('Error adding training example:', error);
      throw error;
    }
  }

  // Get all training examples
  getExamples(): TrainingExample[] {
    return this.trainingData.examples;
  }

  // Calculate Jaccard similarity between two strings
  private calculateSimilarity(str1: string, str2: string): number {
    const set1 = new Set(str1.split(' '));
    const set2 = new Set(str2.split(' '));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }
}

// Export a singleton instance
export const trainingService = new TrainingService(); 