import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // Mock user state: null means logged out, object means logged in
    //later on (when DB and login implemented) we can take the username from JWT
    const [user, setUser] = useState({ username: 'testUsername' });
  
    // Mock login/logout/register functions (implement properly later)
    const login = (username, password) => {
        try {
            if (username && password) {
              setUser({ username });
              return true;
            }
            return false;
        } 
        catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };


    const logout = () => {
        //later implement cookie clearing
        setUser(null);
    }


    const register = (username, password) => {
        try {
            if (username && password) {
              setUser({ username });
              return true;
            }
            return false;
        } 
        catch (error) {
            console.error('Register error:', error);
            return false;
        }
    };

  
    return (
      <AuthContext.Provider value={{ user, login, logout, register}}>
        {children}
      </AuthContext.Provider>
    );
}
  
  // Hook to use AuthContext
  export function useAuth() {
    return useContext(AuthContext);
  }