import { createContext, useContext } from 'react';
import { useAuth } from '../authcontext/authcontext.jsx';

const BinsContext = createContext();

export function BinsProvider({children}) {
    const { user, setUser } = useAuth();

    // mock adding/removing bins using setUser until backend is setup
    const addBin = (name, percentage) => {
        const newBin = { name, percentage };
        setUser(prevUser => ({
            ...prevUser,
            bins: [...prevUser.bins, newBin]
        }));
    };

    const removeBin = (name) => {
        setUser(prevUser => ({
            ...prevUser,
            bins: prevUser.bins.filter(bin => bin.name !== name)
        }));
    };

    return (
        <BinsContext.Provider value={{ bins: user?.bins ?? [], addBin, removeBin }}>
            {children}
        </BinsContext.Provider>
    );
}

export function useBins() {
    return useContext(BinsContext);
}