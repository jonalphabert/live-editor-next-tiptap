import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '@/components/theme/ThemeButton'; // Adjust import path
import { useThemeStore } from '@/store/themeStore';

// Mock the Zustand store
jest.mock('@/store/themeStore', () => ({
  useThemeStore: jest.fn(),
}));

describe('ThemeToggle Component', () => {
  const mockToggleDarkMode = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders light mode icon when darkMode is false', () => {
    // Mock store state for light mode
    (useThemeStore as unknown as jest.Mock).mockImplementation(() => ({
      darkMode: false,
      toggleDarkMode: mockToggleDarkMode,
    }));

    render(<ThemeToggle />);
    
    // Verify moon icon is displayed
    expect(screen.getByText('🌙')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label', 
      'Switch to dark mode'
    );
  });

  it('renders dark mode icon when darkMode is true', () => {
    // Mock store state for dark mode
    (useThemeStore as unknown as jest.Mock).mockImplementation(() => ({
      darkMode: true,
      toggleDarkMode: mockToggleDarkMode,
    }));

    render(<ThemeToggle />);
    
    // Verify sun icon is displayed
    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label', 
      'Switch to light mode'
    );
  });

  it('calls toggleDarkMode when clicked', () => {
    // Mock initial state
    (useThemeStore as unknown as jest.Mock).mockImplementation(() => ({
      darkMode: false,
      toggleDarkMode: mockToggleDarkMode,
    }));

    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    
    // Verify store action was called
    expect(mockToggleDarkMode).toHaveBeenCalledTimes(1);
  });
});