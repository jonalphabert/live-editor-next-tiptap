import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ThemeState = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

// Helper function to detect system theme
const getSystemThemePreference = (): boolean => {
  // Check for SSR (window won't be available)
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      darkMode: getSystemThemePreference(),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      // Only rehydrate (load from storage) if the storage exists
      partialize: (state) => ({ darkMode: state.darkMode }),
    }
  )
);