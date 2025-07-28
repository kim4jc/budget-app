import { createContext, useContext } from 'react';
import { useAuth } from '../authcontext/authcontext.jsx';

const IncomeContext = createContext();

export function IncomeProvider({children}) {
    const { user, setUser } = useAuth();

    //mock adding/removing expenses using setUser until backend is setup
    const addIncome = (name, amount) => {
        const newIncome = { name, amount };
        setUser(prevUser => ({
            ...prevUser,
            income: [...prevUser.income, newIncome]
        }));
    };

    const removeIncome = (name) => {
        setUser(prevUser => ({
            ...prevUser,
            income: prevUser.income.filter(income => income.name !== name)
        }));
    };

    return (
        <IncomeContext.Provider value={{ income: user?.income ?? [], addIncome, removeIncome }}>
            {children}
        </IncomeContext.Provider>
    );
}

export function useIncome() {
    return useContext(IncomeContext)
}