/**
 * Calculate a natural typing delay based on message length and typing speed
 * @param message The message to calculate delay for
 * @param baseDelay Base delay in milliseconds before starting to type
 * @param wordsPerMinute Average typing speed
 * @returns Total delay in milliseconds
 */
type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ar';

export const getSearchingDriverMessage = (language: SupportedLanguage = 'en') => {
  const messages = {
    en: 'I am searching for the nearest driver for you...',
    es: 'Estoy buscando el conductor más cercano para ti...',
    fr: 'Je recherche le chauffeur le plus proche pour vous...',
    de: 'Ich suche den nächstgelegenen Fahrer für Sie...',
    zh: '正在为您寻找最近的司机...',
    ar: '...أبحث عن أقرب سائق لك',
  };
  return messages[language] || messages.en;
};

export const calculateTypingDelay = (
  message: string,
  baseDelay: number = 2000,
  wordsPerMinute: number = 150
): number => {
  // Calculate words in message (roughly)
  const words = message.split(/\s+/).length;
  
  // Calculate typing time based on WPM
  const typingTimeMs = (words / wordsPerMinute) * 60 * 1000;
  
  // Add random variation (±20%)
  const variation = (Math.random() * 0.4 - 0.2) * typingTimeMs;
  
  // Return total delay (base delay + typing time + variation)
  // For booking-related messages, ensure minimum 3 seconds
  const isBookingMessage = message.toLowerCase().includes('book') || 
    message.toLowerCase().includes('ride') || 
    message.toLowerCase().includes('taxi') || 
    message.toLowerCase().includes('driver');

  const minDelay = isBookingMessage ? 3000 : 2000;
  const maxDelay = isBookingMessage ? 4000 : 3000;

  return Math.min(
    Math.max(baseDelay + typingTimeMs + variation, minDelay),
    maxDelay
  ); // Cap at 4 seconds
};

/**
 * Simulate natural typing with a delay
 * @param message The message to delay
 * @param onProgress Optional callback for typing progress
 * @returns Promise that resolves after the delay
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const simulateTyping = async (
  message: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  const delay = calculateTypingDelay(message);
  const startTime = Date.now();
  
  // Initial delay before showing typing indicator
  await sleep(2000);

  return new Promise((resolve) => {
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / delay, 1);
      
      if (onProgress) {
        onProgress(progress);
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        resolve();
      }
    };
    
    updateProgress();
  });
};
