// LogoCombobox.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, within, cleanup } from '@testing-library/react';
import {LogoCombobox} from '@/components/LogoCombobox';
import { LogoOption } from '@/types/LogoType';

// Mock fetch API
global.fetch = jest.fn() as jest.Mock;

// Mock components from shadcn/ui to simplify testing
jest.mock('@/components/ui/command', () => ({
  Command: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CommandEmpty: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CommandGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CommandInput: ({ onValueChange }: { onValueChange: (value: string) => void }) => (
    <input
      data-testid="command-input"
      onChange={(e) => onValueChange(e.target.value)}
    />
  ),
  CommandItem: ({ children, onSelect }: { children: React.ReactNode; onSelect: () => void }) => (
    <div data-testid="command-item" onClick={onSelect}>
      {children}
    </div>
  ),
  CommandList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('lucide-react', () => ({
  ChevronsUpDown: () => <span>▼</span>,
  Check: () => <span>✓</span>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

const mockOptions: LogoOption[] = [
  { logo_slug: 'apple', logo_name: 'Apple', match_score: 0.95 },
  { logo_slug: 'google', logo_name: 'Google', match_score: 0.92 },
];

describe('LogoCombobox', () => {
  const onChangeMock = jest.fn();

   // 1. Reset all mocks and timers before each test
   beforeEach(() => {
    onChangeMock.mockReset();
    (fetch as jest.Mock).mockReset();
    jest.useFakeTimers(); // Use fake timers for debounce
  });

  // 2. Clean up after each test
  afterEach(() => {
    jest.runOnlyPendingTimers(); // Clear any pending timers
    jest.useRealTimers(); // Restore real timers
    cleanup(); // Clean up DOM
  });

  test('renders correctly with initial value', () => {
    render(<LogoCombobox value={mockOptions[0]} onChange={onChangeMock} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('shows placeholder when no value is selected', () => {
    render(<LogoCombobox value={null} onChange={onChangeMock} />);
    expect(screen.getByText('Select a logo...')).toBeInTheDocument();
  });

  test('opens popover when clicked', async () => {
    render(<LogoCombobox value={null} onChange={onChangeMock} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('command-input')).toBeInTheDocument();
  });

  test('shows minimum character message when typing less than 3 characters', async () => {
    render(<LogoCombobox value={null} onChange={onChangeMock} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByTestId('command-input');
    
    fireEvent.change(input, { target: { value: 'ap' } });
    await waitFor(() => {
      expect(screen.getByText('Type at least 3 characters')).toBeInTheDocument();
    });
  });

  test('fetches logos when typing 3+ characters', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockOptions,
    });

    render(<LogoCombobox value={null} onChange={onChangeMock} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByTestId('command-input');
    
    fireEvent.change(input, { target: { value: 'app' } });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/logos?q=app');
    });
    
    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Google')).toBeInTheDocument();
    });
  });

  test('shows loading state while fetching', async () => {
    (fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));

    render(<LogoCombobox value={null} onChange={onChangeMock} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByTestId('command-input');
    
    fireEvent.change(input, { target: { value: 'apple' } });
    
    await waitFor(() => {
      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });
  });

  test('shows "No logos found" when there are no results', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => [],
    });

    render(<LogoCombobox value={null} onChange={onChangeMock} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByTestId('command-input');
    
    fireEvent.change(input, { target: { value: 'xyz' } });
    
    await waitFor(() => {
      expect(screen.getByText('No logos found')).toBeInTheDocument();
    });
  });

  test('show "No logos found" when error occurs', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<LogoCombobox value={null} onChange={onChangeMock} />);
    fireEvent.click(screen.getByRole('button'));
    const input = screen.getByTestId('command-input');
    
    fireEvent.change(input, { target: { value: 'xyz' } });
    
    await waitFor(() => {
      expect(screen.getByText('No logos found')).toBeInTheDocument();
    });
  });

  test('shows the match score on the options logo', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockOptions,
      });
  
      render(<LogoCombobox value={null} onChange={onChangeMock} />);
      fireEvent.click(screen.getByRole('button'));
      const input = screen.getByTestId('command-input');
      
      fireEvent.change(input, { target: { value: 'app' } });
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/logos?q=app');
      });
      
      await waitFor(() => {
        expect(screen.getByText('95%')).toBeInTheDocument();
        expect(screen.getByText('92%')).toBeInTheDocument();
      });
  });

  test('choose an logo option from the list', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => mockOptions,
      });
  
      render(<LogoCombobox value={null} onChange={onChangeMock} />);
      fireEvent.click(screen.getByRole('button'));
      const input = screen.getByTestId('command-input');
      
      fireEvent.change(input, { target: { value: 'app' } });
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/logos?q=app');
      });
      
      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Google')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Apple'));
      
      await waitFor(() => {
        expect(onChangeMock).toHaveBeenCalledWith(mockOptions[0]);
      });
  });
});