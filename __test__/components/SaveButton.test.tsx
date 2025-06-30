import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SaveButton from "@/components/SaveButton";
import { useModalStore } from "@/store/BlogCreate";

jest.mock('@/store/BlogCreate', () => ({
    useModalStore: jest.fn(),
  }));

describe("SaveButton", () => {
    const mockSaveAsMarkdown = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useModalStore as unknown as jest.Mock).mockImplementation((selector) => {
          return selector({ saveAsMarkdown: mockSaveAsMarkdown });
        });
      });

    it("renders correctly", () => {
        render(<SaveButton />);
        expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it('calls saveAsMarkdown function when clicked', () => {
        render(<SaveButton />);
        
        const button = screen.getByRole('button', { name: /save/i });
        fireEvent.click(button);
        
        expect(mockSaveAsMarkdown).toHaveBeenCalledTimes(1);
      });

    it('matches snapshot', () => {
        const { asFragment } = render(<SaveButton />);
        expect(asFragment()).toMatchSnapshot();
      });
});