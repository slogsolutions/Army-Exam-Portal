import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (armyNo, password) => {
    // Mock login for now - will connect to backend later
    if (armyNo === 'ADMIN001' && password === 'admin123') {
      const user = {
        armyNo: 'ADMIN001',
        rank: 'Admin',
        name: 'System Administrator',
        trade: 'Administration',
        role: 'admin'
      };
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};