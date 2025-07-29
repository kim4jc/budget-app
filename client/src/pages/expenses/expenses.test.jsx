import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExpensesPage from './expenses.jsx';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock useExpenses and useIncome
const mockAddExpense = vi.fn();
const mockRemoveExpense = vi.fn();
const mockAddIncome = vi.fn();
const mockRemoveIncome = vi.fn();

let mockExpenses = [];
let mockIncome = [];

vi.mock('../../context/authcontext/expensecontext.jsx', () => ({
    useExpenses: () => ({
        expenses: mockExpenses,
        addExpense: mockAddExpense,
        removeExpense: mockRemoveExpense,
    }),
}));

vi.mock('../../context/authcontext/incomecontext.jsx', () => ({
    useIncome: () => ({
        income: mockIncome,
        addIncome: mockAddIncome,
        removeIncome: mockRemoveIncome,
    }),
}));

beforeEach(() => {
    mockExpenses = [];
    mockIncome = [];
    mockAddExpense.mockReset();
    mockRemoveExpense.mockReset();
    mockAddIncome.mockReset();
    mockRemoveIncome.mockReset();
    vi.spyOn(window, 'alert').mockImplementation(() => {}); // mock alert
});

describe('ExpensesPage', () => {
    test('renders Income and Expenses sections', () => {
        render(
            <MemoryRouter>
                <ExpensesPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/Income/i)).toBeInTheDocument();
        expect(screen.getByText(/Expenses/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Income Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Expense Name/i)).toBeInTheDocument();
    });

    test('can add a new income item', async () => {
        render(
            <MemoryRouter>
                <ExpensesPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Income Name/i), { target: { value: 'Job' } });
        fireEvent.change(screen.getAllByPlaceholderText(/Amount/i)[0], { target: { value: '2000' } });

        fireEvent.click(screen.getAllByRole('button', { name: /^Add$/i })[0]); // Add button for income

        await waitFor(() => {
            expect(mockAddIncome).toHaveBeenCalledWith('Job', '2000.00');
        });
    });

    test('can add a new expense item', async () => {
        render(
            <MemoryRouter>
                <ExpensesPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Expense Name/i), { target: { value: 'Rent' } });
        fireEvent.change(screen.getAllByPlaceholderText(/Amount/i)[1], { target: { value: '800' } });

        fireEvent.click(screen.getAllByRole('button', { name: /^Add$/i })[1]); // Add button for expense

        await waitFor(() => {
            expect(mockAddExpense).toHaveBeenCalledWith('Rent', '800.00');
        });
    });

    test('can remove an income item', () => {
        mockIncome = [{ name: 'Job', amount: '2000.00' }];

        render(
            <MemoryRouter>
                <ExpensesPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText(/Remove/i));
        expect(mockRemoveIncome).toHaveBeenCalledWith('Job');
    });

    test('can remove an expense item', () => {
        mockExpenses = [{ name: 'Rent', amount: '800.00' }];

        render(
            <MemoryRouter>
                <ExpensesPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText(/Remove/i));
        expect(mockRemoveExpense).toHaveBeenCalledWith('Rent');
    });
});