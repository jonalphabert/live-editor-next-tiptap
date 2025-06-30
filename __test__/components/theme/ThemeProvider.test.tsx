import ThemeProvider from '@/components/theme/ThemeProvider'; // Adjust import path
import { render } from '@testing-library/react';
import { useThemeStore } from '@/store/themeStore';

// Mock Zustand store with proper typing
jest.mock('@/store/themeStore', () => ({
  useThemeStore: jest.fn(),
}));

describe('ThemeProvider', () => {
  // Use type assertion for the mock
  const mockUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>;
  const originalClassName = document.documentElement.className;

  beforeEach(() => {
    // Reset DOM and mocks before each test
    document.documentElement.className = '';
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore original class after all tests
    document.documentElement.className = originalClassName;
  });

  it('adds dark class when darkMode is true', () => {
    // Mock store with dark mode enabled
    mockUseThemeStore.mockReturnValue({ darkMode: true } as any);
    
    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    expect(document.documentElement).toHaveClass('dark');
  });

  it('removes dark class when darkMode is false', () => {
    // Start with dark class present
    document.documentElement.classList.add('dark');
    
    // Mock store with dark mode disabled
    mockUseThemeStore.mockReturnValue({ darkMode: false } as any);
    
    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('updates class when darkMode changes', () => {
    // First render with dark mode off
    mockUseThemeStore.mockReturnValue({ darkMode: false } as any);
    const { rerender } = render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );
    expect(document.documentElement).not.toHaveClass('dark');

    // Update to dark mode on
    mockUseThemeStore.mockReturnValue({ darkMode: true } as any);
    rerender(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );
    expect(document.documentElement).toHaveClass('dark');

    // Update back to dark mode off
    mockUseThemeStore.mockReturnValue({ darkMode: false } as any);
    rerender(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );
    expect(document.documentElement).not.toHaveClass('dark');
  });
});