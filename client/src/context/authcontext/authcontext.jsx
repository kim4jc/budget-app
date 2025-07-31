import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
      try {
        // Call backend endpoint to verify token & get user info
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/checkAuth`, {
          method: 'GET',
          credentials: 'include',
        });
  
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null); // no valid token or logged out
        }
      } catch (err) {
        console.error('Auth check failed', err);
        setUser(null);
      }
      setLoading(false);
    };
  
    useEffect(() => {
      checkAuth();
    }, []);
  
    const login = async (username, password) => {
      //call backend endpoint to login user
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        credentials: 'include', // must include credentials to send and receive cookies
        body: JSON.stringify({ username, password }), //send username and password in request body as a json object
      });

      //if not a response status in 200s then error
      if (!res.ok) {
        //throw error from response
        const error = await res.json();
        throw new Error(error.error || 'Login failed');
      }
  
      const data = await res.json();
      setUser({ username: data.username });
      return data;
    };


    const logout = async () => {
      //call backend for logout (this clears cookies)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      //return the response (successful logout msg)
      return await res.json()
    };


    const register = async (username, password) => {
      //call backend endpoint to register user
      console.log(import.meta.env.VITE_API_URL)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      });

      //if not a response status in 200s then error
      if (!res.ok) {
        //throw error from response
        const error = await res.json();
        throw new Error(error.error || 'Registration failed');
      }

      //return the response (success msg)
      return await res.json();
    };

  
    return (
      <AuthContext.Provider value={{ user, setUser, loading, login, logout, register}}>
        {children}
      </AuthContext.Provider>
    );
}
  
  // Hook to use AuthContext
  export function useAuth() {
    return useContext(AuthContext);
  }