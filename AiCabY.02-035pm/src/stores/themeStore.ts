import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDarkMode: true, // Default to dark mode
      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
        // Force a document class update
        document.documentElement.classList.toggle('dark', !document.documentElement.classList.contains('dark'));
      },
    }),
    {
      name: 'theme-storage',
    }
  )
); 