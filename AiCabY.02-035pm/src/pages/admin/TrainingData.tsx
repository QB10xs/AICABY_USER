import React, { useState, useEffect } from 'react';
import { trainingService } from '@/services/trainingService';
import { TrainingExample } from '@/types/training';

const TrainingData: React.FC = () => {
  console.log('TrainingData component rendering');
  const [examples, setExamples] = useState<TrainingExample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newExample, setNewExample] = useState<Partial<TrainingExample>>({
    userInput: '',
    aiResponse: '',
    intent: '',
    entities: {},
    context: {
      lastQuestion: '',
      pendingLocation: undefined
    }
  });

  useEffect(() => {
    console.log('TrainingData useEffect running');
    const loadData = async () => {
      try {
        console.log('Starting to load training data');
        setLoading(true);
        setError(null);
        
        // Force a fresh load from Supabase
        console.log('Calling trainingService.loadTrainingData()');
        await trainingService.loadTrainingData();
        
        console.log('Getting examples from training service');
        const loadedExamples = trainingService.getExamples();
        console.log('Loaded examples:', loadedExamples);
        
        setExamples(loadedExamples);
      } catch (err) {
        console.error('Error in loadData:', err);
        setError(err instanceof Error ? err.message : 'Failed to load training data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddExample = async () => {
    if (!newExample.userInput || !newExample.aiResponse || !newExample.intent) return;

    try {
      setLoading(true);
      await trainingService.addExample(newExample as TrainingExample);
      setExamples(trainingService.getExamples());
      setNewExample({
        userInput: '',
        aiResponse: '',
        intent: '',
        entities: {},
        context: {
          lastQuestion: '',
          pendingLocation: undefined
        }
      });
    } catch (err) {
      console.error('Error adding example:', err);
      alert('Failed to add example. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        setLoading(true);
        const data = JSON.parse(event.target?.result as string);
        await trainingService.loadTrainingData(data);
        setExamples(trainingService.getExamples());
      } catch (error) {
        console.error('Error loading training data:', error);
        alert('Error loading training data. Please check the file format.');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">Loading training data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <h2 className="text-lg font-semibold mb-2">Error Loading Data</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Training Data Management</h1>

      {/* Upload Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Upload Training Data</h2>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-accent hover:file:bg-primary/90"
        />
      </div>

      {/* Add New Example Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Example</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Input
            </label>
            <input
              type="text"
              value={newExample.userInput}
              onChange={(e) => setNewExample({ ...newExample, userInput: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="What the user might say..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AI Response
            </label>
            <textarea
              value={newExample.aiResponse}
              onChange={(e) => setNewExample({ ...newExample, aiResponse: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              rows={3}
              placeholder="How AICABY should respond..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intent
            </label>
            <input
              type="text"
              value={newExample.intent}
              onChange={(e) => setNewExample({
                ...newExample,
                intent: e.target.value
              })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g., book_ride, price_inquiry, etc."
            />
          </div>

          <button
            onClick={handleAddExample}
            disabled={!newExample.userInput || !newExample.aiResponse || !newExample.intent || loading}
            className={`
              w-full py-2 rounded-lg font-medium
              ${(!newExample.userInput || !newExample.aiResponse || !newExample.intent || loading)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary text-accent hover:bg-primary/90'
              }
            `}
          >
            {loading ? 'Adding...' : 'Add Example'}
          </button>
        </div>
      </div>

      {/* Examples List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Training Examples ({examples.length})
        </h2>
        {examples.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No training examples yet. Add your first example above.
          </div>
        ) : (
          <div className="space-y-4">
            {examples.map((example, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="font-medium text-gray-700">Input:</div>
                <div className="mb-2">{example.userInput}</div>
                <div className="font-medium text-gray-700">Response:</div>
                <div className="mb-2">{example.aiResponse}</div>
                <div className="font-medium text-gray-700">Intent:</div>
                <div className="text-sm text-gray-600">{example.intent}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingData; 