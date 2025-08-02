import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../authcontext/authcontext.jsx';

const BinsContext = createContext();

export function BinsProvider({children}) {
    const { user } = useAuth();
    const [bins, setBins] = useState([]);

    const fetchBins = async () => {
          if (!user) return; // safety check
          try {
              const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bins`, {
                  credentials: 'include',
              });
              if (!res.ok) throw new Error('Failed to fetch bins');
                  const data = await res.json();
                  setBins(data);
          } catch (error) {
              console.error('Error fetching bins:', error);
              setBins([]);
          }
      };

    // fetch bins when user changes (initial load)
    useEffect(() => {
        if (user) {
            fetchBins(); // fetch bins only when useris present 
        } else {
            setBins([]); // clear bins when user logs out
        }
    }, [user]);
    
    // add bin: Post to backend, update local state on success
    const addBin = async (name, percentage) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bins`, {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json' 
                },
                credentials: 'include',
                body: JSON.stringify ({ name, percentage }),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Failed to add bin: ${text}`);
            }
            await fetchBins();
        } catch (error) {
            console.error('Error adding bin:', error);
            alert('Error adding bin');
        }
    };

    // same as add bin -> updating local state after successful ping
    const removeBin = async (name, percentage) => {
        try {
            const url = new URL(`${import.meta.env.VITE_API_URL}/api/bins`);
            url.searchParams.append('name', name);
            url.searchParams.append('percentage', percentage);

            const res = await fetch(url.toString(), {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Failed to remove bin: ${text}`);
            }
            await fetchBins();
        } catch (error) {
            console.error('Error removing bin:', error);
            alert('Error removing bin');
        }
    };

    return (
        <BinsContext.Provider value={{ bins, addBin, removeBin }}>
            {children}
        </BinsContext.Provider>
    );
}

export function useBins() {
    return useContext(BinsContext);
}