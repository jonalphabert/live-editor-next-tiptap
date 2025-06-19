'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

type ThemeProviderProps = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { darkMode } = useThemeStore();

  useEffect(() => {
    // Apply theme class to document element
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return <>{children}</>;
}