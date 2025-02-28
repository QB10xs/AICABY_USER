import React, { useState, useEffect } from 'react';
import { trainingService } from '@/services/trainingService';
import { TrainingExample } from '@/types/training';

const TrainingData: React.FC = () => {
  const [examples, setExamples] = useState<TrainingExample[]>([]);
  const [newExample, setNewExample] = useState<Partial<TrainingExample>>({
    userInput: '',
    aiResponse: '',
    context: {
      intent: '',
    },
  });

  useEffect(() => {
    setExamples(trainingService.getExamples());
  }, []);

  const handleAddExample = () => {
    if (!newExample.userInput || !newExample.aiResponse) return;

    trainingService.addExample(newExample as TrainingExample);
    setExamples(trainingService.getExamples());
    setNewExample({
      userInput: '',
      aiResponse: '',
      context: {
        intent: '',
      },
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        await trainingService.loadTrainingData(data);
        setExamples(trainingService.getExamples());
      } catch (error) {
        console.error('Error loading training data:', error);
        alert('Error loading training data. Please check the file format.');
      }
    };

    reader.readAsText(file);
  };

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
              value={newExample.context?.intent}
              onChange={(e) => setNewExample({
                ...newExample,
                context: { ...newExample.context, intent: e.target.value },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g., book_ride, price_inquiry, etc."
            />
          </div>

          <button
            onClick={handleAddExample}
            disabled={!newExample.userInput || !newExample.aiResponse}
            className={`
              w-full py-2 rounded-lg font-medium
              ${(!newExample.userInput || !newExample.aiResponse)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary text-accent hover:bg-primary/90'
              }
            `}
          >
            Add Example
          </button>
        </div>
      </div>

      {/* Examples List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Training Examples</h2>
        <div className="space-y-4">
          {examples.map((example, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="font-medium text-gray-700">Input:</div>
              <div className="mb-2">{example.userInput}</div>
              <div className="font-medium text-gray-700">Response:</div>
              <div className="mb-2">{example.aiResponse}</div>
              <div className="font-medium text-gray-700">Intent:</div>
              <div className="text-sm text-gray-600">{example.context?.intent}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainingData; 