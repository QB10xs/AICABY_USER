import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

export const useDarkMode = () => {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // Apply dark mode class to html element
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return { isDarkMode };
};
