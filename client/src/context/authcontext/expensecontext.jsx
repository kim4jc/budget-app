import { createContext, useContext } from 'react';
import { useAuth } from '../authcontext/authcontext.jsx';

const ExpenseContext = createContext();

export function ExpenseProvider({children}) {
    const { user, setUser } = useAuth();

    //mock adding/removing expenses using setUser until backend is setup
    const addExpense = (name, amount) => {
        //Added 'date' and parsed 'amount' ---
        const newExpense = {
            name,
            amount: parseFloat(amount), // Ensure amount is a number for calculations
            date: new Date().toISOString() // Store current date/time as ISO string
        };

        // Ensure user and user.expenses exist before attempting to spread
        setUser(prevUser => {
            const currentExpenses = prevUser?.expenses || []; // Handle case where expenses might be undefined
            return {
                ...prevUser,
                expenses: [...currentExpenses, newExpense]
            };
        });
    };

    const removeExpense = (name) => {
        setUser(prevUser => ({
            ...prevUser,
            expenses: prevUser.expenses.filter(expense => expense.name !== name)
        }));
    };

    return (
        <ExpenseContext.Provider value={{ expenses: user?.expenses ?? [], addExpense, removeExpense }}>
            {children}
        </ExpenseContext.Provider>
    );
}

export function useExpenses() {
    return useContext(ExpenseContext)
}