import { createContext, useContext, useState } from 'react';

import { useAuth } from '../authcontext/authcontext.jsx';

const ExpenseContext = createContext();

export function ExpenseProvider({children}) {
    const { user, setUser } = useAuth();

    const [expenses, setExpenses] = useState(user?.expenses ?? []);

    const addExpense = async (name, amount) => {
        try {
            const payload = { name, amount: parseFloat(amount) };
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/createExpense`, {
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

    const removeExpense = (name) => {
        setExpenses(prev => prev.filter(expense => expense.name !== name));
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

