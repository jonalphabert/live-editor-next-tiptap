// Navbar.test.tsx
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import {Navbar} from '@/components/Navbar'; // Adjust the import path as needed
import '@testing-library/jest-dom';

// Mock external components
jest.mock('@/components/theme/ThemeButton', () => ({
  __esModule: true,
  default: () => <button data-testid="theme-toggle">Theme Toggle</button>,
}));

jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href}>{children}</a>
    );
  });
  
  jest.mock('@/components/ui/sheet', () => ({
    Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SheetTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SheetContent: ({ children }: { children: React.ReactNode }) => (
      <div role="dialog-menu">{children}</div>
    ),
    SheetClose: ({ children }: { children: React.ReactNode }) => <div role="dialog-close">{children}</div>,
  }));
  
  jest.mock('@/components/ui/button', () => ({
    Button: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
      <button {...props}>{children}</button>
    ),
  }));
  
  describe('Navbar Component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('renders correctly with logo and navigation elements', () => {
      render(<Navbar />);
      
      expect(screen.getByText('OpenEditor')).toBeInTheDocument();
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
      // Check for at least one theme toggle
      expect(screen.getAllByTestId('theme-toggle').length).toBeGreaterThan(0);
    });
  
    it('shows desktop navigation links', () => {
      render(<Navbar />);
      
      expect(screen.getAllByText('Home')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Editor')[0]).toBeInTheDocument();
      expect(screen.getAllByText('See Project on Github')[0]).toBeInTheDocument();
    });
  
    it('has correct href attributes in desktop links', () => {
      render(<Navbar />);
      
      const homeLink = screen.getAllByText('Home')[0].closest('a');
      const editorLink = screen.getAllByText('Editor')[0].closest('a');
      const githubLink = screen.getAllByText('See Project on Github')[0].closest('a');
      
      expect(homeLink).toHaveAttribute('href', '/');
      expect(editorLink).toHaveAttribute('href', '/editor');
      expect(githubLink).toHaveAttribute(
        'href',
        'https://github.com/jonalphabert/live-editor-next-tiptap'
      );
    });
  
    it('opens mobile menu when hamburger icon is clicked', () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText('Open menu');
      fireEvent.click(menuButton);
      
      const mobileMenu = screen.getByRole('dialog-menu');
      expect(mobileMenu).toBeInTheDocument();
      expect(within(mobileMenu).getByText('Home')).toBeInTheDocument();
      expect(within(mobileMenu).getByText('Editor')).toBeInTheDocument();
    });
  
    it('has theme toggle in both desktop and mobile sections', () => {
      render(<Navbar />);
      
      const themeToggles = screen.getAllByTestId('theme-toggle');
      expect(themeToggles).toHaveLength(2);
    });
  
    it('displays footer text in mobile menu', () => {
      render(<Navbar />);
      
      fireEvent.click(screen.getByLabelText('Open menu'));
      const mobileMenu = screen.getByRole('dialog-menu');
      
      expect(
        within(mobileMenu).getByText('The modern markdown editor for GitHub')
      ).toBeInTheDocument();
    });
  });