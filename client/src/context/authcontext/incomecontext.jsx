import { createContext, useContext, useState, useEffect} from 'react';

import { useAuth } from '../authcontext/authcontext.jsx';

const IncomeContext = createContext();

export function IncomeProvider({children}) {
    const { user } = useAuth();

    const [income, setIncome] = useState(user?.income ?? []);

    // Fetch all income when component mounts
    useEffect(() => {
        const fetchIncome = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/income`, {
            method: 'GET',
            credentials: 'include'
            });
            const data = await response.json();
            setIncome(data);
        } catch (err) {
            console.error('Error fetching income:', err);
        }
        };

        if (user) {
        fetchIncome();
        }
    }, [user]);

    const addIncome = async (name, amount) => {
        try {
            const payload = { name, amount: parseFloat(amount) };
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/income/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const newIncome = await response.json();
            setIncome(prev => [...prev, newIncome]);

        } catch (error) {
            console.error('Caught error in addIncome:', error);
            alert('Error adding income');
        }
    };

    const removeIncome = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/income/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setIncome(prev => prev.filter(income => income.id !== id));
    } catch (err) {
      console.error('Error deleting income:', err);
      alert('Failed to delete income');
    }
  };

    return (
        <IncomeContext.Provider value={{ income, addIncome, removeIncome }}>
            {children}
        </IncomeContext.Provider>
    );
}

export function useIncome() {
    return useContext(IncomeContext);

}

