'use client';

import { useThemeStore } from '@/store/themeStore';
import { Button } from '../ui/button';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useThemeStore();

  return (
    <Button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <span className="text-yellow-300">☀️</span>
      ) : (
        <span className="text-gray-700">🌙</span>
      )}
    </Button>
  );
}