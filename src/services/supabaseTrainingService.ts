import { supabase } from '@/lib/supabaseClient';
import { TrainingData, TrainingExample } from '@/types/training';

export const supabaseTrainingService = {
  async fetchTrainingData(): Promise<TrainingData> {
    try {
      console.log('Fetching training examples from Supabase...');
      
      const { data: examples, error: examplesError } = await supabase
        .from('training_examples')
        .select('*')
        .order('created_at', { ascending: true });

      if (examplesError) {
        console.error('Supabase error fetching examples:', examplesError);
        throw new Error(`Error fetching training examples: ${examplesError.message}`);
      }
      console.log('Fetched examples from Supabase:', examples);

      console.log('Fetching training metadata from Supabase...');
      const { data: metadata, error: metadataError } = await supabase
        .from('training_metadata')
        .select('*')
        .single();

      if (metadataError) {
        console.error('Supabase error fetching metadata:', metadataError);
        throw new Error(`Error fetching training metadata: ${metadataError.message}`);
      }
      console.log('Fetched metadata from Supabase:', metadata);

      const trainingData = {
        examples: examples as TrainingExample[],
        metadata: {
          version: metadata?.version || '1.0.0',
          lastUpdated: metadata?.last_updated || new Date().toISOString(),
          totalExamples: examples?.length || 0,
        },
      };
      
      console.log('Returning training data:', trainingData);
      return trainingData;
    } catch (error) {
      console.error('Error in fetchTrainingData:', error);
      throw error;
    }
  },

  async bulkInsertExamples(examples: TrainingExample[]): Promise<void> {
    try {
      console.log('Bulk inserting examples:', examples);
      const { error } = await supabase
        .from('training_examples')
        .insert(examples.map(example => ({
          user_input: example.userInput,
          ai_response: example.aiResponse,
          context: example.context || {}
        })));

      if (error) {
        console.error('Error bulk inserting examples:', error);
        throw new Error(`Error bulk inserting examples: ${error.message}`);
      }

      // Update metadata
      const { error: metadataError } = await supabase
        .from('training_metadata')
        .update({
          last_updated: new Date().toISOString(),
          total_examples: examples.length
        })
        .eq('id', 1);

      if (metadataError) {
        console.error('Error updating metadata:', metadataError);
      }

      console.log('Successfully inserted examples');
    } catch (error) {
      console.error('Error in bulkInsertExamples:', error);
      throw error;
    }
  },

  async addTrainingExample(example: TrainingExample): Promise<void> {
    try {
      const { error } = await supabase
        .from('training_examples')
        .insert([{
          user_input: example.userInput,
          ai_response: example.aiResponse,
          context: example.context || {}
        }]);

      if (error) {
        throw new Error(`Error adding training example: ${error.message}`);
      }

      // Update metadata
      const { error: metadataError } = await supabase
        .from('training_metadata')
        .update({
          last_updated: new Date().toISOString(),
        })
        .eq('id', 1);

      if (metadataError) {
        console.error('Error updating metadata:', metadataError);
      }
    } catch (error) {
      console.error('Error in addTrainingExample:', error);
      throw error;
    }
  },

  async updateTrainingExample(id: number, example: Partial<TrainingExample>): Promise<void> {
    try {
      const { error } = await supabase
        .from('training_examples')
        .update(example)
        .eq('id', id);

      if (error) {
        throw new Error(`Error updating training example: ${error.message}`);
      }

      // Update metadata
      const { error: metadataError } = await supabase
        .from('training_metadata')
        .update({
          last_updated: new Date().toISOString(),
        })
        .eq('id', 1);

      if (metadataError) {
        console.error('Error updating metadata:', metadataError);
      }
    } catch (error) {
      console.error('Error in updateTrainingExample:', error);
      throw error;
    }
  },

  async deleteTrainingExample(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('training_examples')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Error deleting training example: ${error.message}`);
      }

      // Update metadata
      const { error: metadataError } = await supabase
        .from('training_metadata')
        .update({
          last_updated: new Date().toISOString(),
        })
        .eq('id', 1);

      if (metadataError) {
        console.error('Error updating metadata:', metadataError);
      }
    } catch (error) {
      console.error('Error in deleteTrainingExample:', error);
      throw error;
    }
  },
}; 