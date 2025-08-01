import { createContext, useContext, useState, useEffect} from 'react';

import { useAuth } from '../authcontext/authcontext.jsx';

const ExpenseContext = createContext();

export function ExpenseProvider({children}) {
    const { user } = useAuth();

    const [expenses, setExpenses] = useState(user?.expenses ?? []);

    // Fetch all expenses when component mounts
    useEffect(() => {
        const fetchExpenses = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
            method: 'GET',
            credentials: 'include'
            });
            const data = await response.json();
            setExpenses(data);
        } catch (err) {
            console.error('Error fetching expenses:', err);
        }
        };

        if (user) {
        fetchExpenses();
        }
    }, [user]);

    const addExpense = async (name, amount) => {
        try {
            const payload = { name, amount: parseFloat(amount) };
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const newExpense = await response.json();
            setExpenses(prev => [...prev, newExpense]);

        } catch (error) {
            console.error('Caught error in addExpense:', error);
            alert('Error adding expense');
        }
    };

    const removeExpense = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
      alert('Failed to delete expense');
    }
  };

    return (
        <ExpenseContext.Provider value={{ expenses, addExpense, removeExpense }}>
            {children}
        </ExpenseContext.Provider>
    );
}

export function useExpenses() {
    return useContext(ExpenseContext)

}

