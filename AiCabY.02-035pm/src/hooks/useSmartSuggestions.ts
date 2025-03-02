import { useState, useEffect } from 'react';
import { SmartSuggestion } from '@/types/smart';
import { smartSuggestionsService } from '@/services/smartSuggestions';

export const useSmartSuggestions = () => {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const smartSuggestions = await smartSuggestionsService.getSuggestions({});
        setSuggestions(smartSuggestions);
      } catch (err) {
        setError('Failed to load suggestions');
        console.error('Error fetching suggestions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
    // Refresh suggestions every 5 minutes
    const interval = setInterval(fetchSuggestions, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshSuggestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const smartSuggestions = await smartSuggestionsService.getSuggestions({});
      setSuggestions(smartSuggestions);
    } catch (err) {
      setError('Failed to refresh suggestions');
      console.error('Error refreshing suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    suggestions,
    isLoading,
    error,
    refreshSuggestions
  };
}; 