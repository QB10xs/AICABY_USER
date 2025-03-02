import { useState, useEffect } from 'react';
import { generateResponse } from '@/services/ai';

export default function TestAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState({
    deepseek: {
      present: false,
      format: false
    },
    openrouter: {
      present: false,
      format: false
    }
  });

  useEffect(() => {
    // Check API keys on component mount
    const deepseekKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    const openrouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    setApiStatus({
      deepseek: {
        present: !!deepseekKey,
        format: deepseekKey?.startsWith('sk-') || false
      },
      openrouter: {
        present: !!openrouterKey,
        format: openrouterKey?.length > 20 || false // Basic length check
      }
    });
  }, []);

  const testNormalFlow = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const result = await generateResponse('Hello, I need a taxi', 'detailed');
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">AI Service Test Page</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">API Configuration Status</h2>
        <div className="space-y-2">
          <div>
            <p className="font-medium">DeepSeek API:</p>
            <ul className="list-disc ml-6">
              <li className={apiStatus.deepseek.present ? 'text-green-600' : 'text-red-600'}>
                Key Present: {apiStatus.deepseek.present ? 'Yes' : 'No'}
              </li>
              <li className={apiStatus.deepseek.format ? 'text-green-600' : 'text-red-600'}>
                Key Format Valid: {apiStatus.deepseek.format ? 'Yes' : 'No'}
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium">OpenRouter API:</p>
            <ul className="list-disc ml-6">
              <li className={apiStatus.openrouter.present ? 'text-green-600' : 'text-red-600'}>
                Key Present: {apiStatus.openrouter.present ? 'Yes' : 'No'}
              </li>
              <li className={apiStatus.openrouter.format ? 'text-green-600' : 'text-red-600'}>
                Key Format Valid: {apiStatus.openrouter.format ? 'Yes' : 'No'}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={testNormalFlow}
          disabled={loading || (!apiStatus.deepseek.present && !apiStatus.openrouter.present)}
          className={`px-4 py-2 rounded ${
            loading || (!apiStatus.deepseek.present && !apiStatus.openrouter.present)
              ? 'bg-gray-400'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {loading ? 'Testing...' : 'Test AI Response'}
        </button>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 rounded">
            <p className="text-red-700 font-medium">Error:</p>
            <pre className="whitespace-pre-wrap text-sm">{error}</pre>
          </div>
        )}

        {response && (
          <div className="p-4 bg-green-100 border border-green-400 rounded">
            <p className="text-green-700 font-medium">Response:</p>
            <pre className="whitespace-pre-wrap text-sm">{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
} 