import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BinsPage from './spending.jsx';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';


vi.mock('../../context/authcontext/binscontext.jsx', () => ({
    useBins: () => ({
        bins: mockBins,
        addBin: mockAddBin,
        removeBin: mockRemoveBin,
    }),
}));

// Needed to bypass context issue
vi.mock('react-chartjs-2', () => ({
    Pie: () => <div>Mocked Pie Chart</div>,
}));

let mockBins = [];
const mockAddBin = vi.fn();
const mockRemoveBin = vi.fn();

// Helper to reset mocks before each test
beforeEach(() => {
    mockBins = [];
    mockAddBin.mockReset();
    mockRemoveBin.mockReset();
    vi.spyOn(window, 'alert').mockImplementation(() => {}); // mock alert
});

describe('BinsPage', () => {
    test('renders with no bins', () => {
        render(
            <MemoryRouter>
                <BinsPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/Your Bins/i)).toBeInTheDocument();
        expect(screen.getByText(/No bins to display/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Bin Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Percentage/i)).toBeInTheDocument();
    });

    test('shows bins list and pie chart when bins exist', () => {
        mockBins = [
            { name: 'Food', percentage: 40 },
            { name: 'Rent', percentage: 50 },
        ];

        render(
            <MemoryRouter>
                <BinsPage />
            </MemoryRouter>
        );

        expect(screen.queryByText(/No bins to display/i)).toBeNull();
        expect(screen.getByText(/Food - 40%/i)).toBeInTheDocument();
        expect(screen.getByText(/Rent - 50%/i)).toBeInTheDocument();
    });

    test('adds a bin when valid inputs are provided', async () => {
        render(
            <MemoryRouter>
                <BinsPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Bin Name/i), { target: { value: 'Savings' } });
        fireEvent.change(screen.getByPlaceholderText(/Percentage/i), { target: { value: '20' } });
        fireEvent.click(screen.getByRole('button', { name: /Add Bin/i }));

        await waitFor(() => {
            expect(mockAddBin).toHaveBeenCalledWith('Savings', 20);
        });
    });

    // Throws issue for message context, it works
    test('alerts if bin name is empty', () => {
        render(
            <MemoryRouter>
                <BinsPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Percentage/i), { target: { value: '20' } });
        fireEvent.click(screen.getByRole('button', { name: /Add Bin/i }));

        expect(window.alert).toHaveBeenCalledWith('Bin must be named.');
        expect(mockAddBin).not.toHaveBeenCalled();
    });

    test('alerts if percentage is not a valid whole number between 1 and 100', () => {
        render(
            <MemoryRouter>
                <BinsPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Bin Name/i), { target: { value: 'Entertainment' } });
        fireEvent.change(screen.getByPlaceholderText(/Percentage/i), { target: { value: '150' } });
        fireEvent.click(screen.getByRole('button', { name: /Add Bin/i }));

        expect(window.alert).toHaveBeenCalledWith('Percentage must be a whole number between 1 and 100.');
        expect(mockAddBin).not.toHaveBeenCalled();
    });

    test('removes a bin when clicking Remove', () => {
        mockBins = [{ name: 'Travel', percentage: 30 }];

        render(
            <MemoryRouter>
                <BinsPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText(/Remove/i));
        expect(mockRemoveBin).toHaveBeenCalledWith('Travel');
      });
});