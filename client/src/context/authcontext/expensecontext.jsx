import { createContext, useContext } from 'react';
import { useAuth } from '../authcontext/authcontext.jsx';

const ExpenseContext = createContext();

export function ExpenseProvider({children}) {
    const { user, setUser } = useAuth();

    //mock adding/removing expenses using setUser until backend is setup
    const addExpense = (name, amount) => {
        const newExpense = { name, amount };
        setUser(prevUser => ({
            ...prevUser,
            expenses: [...prevUser.expenses, newExpense]
        }));
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