import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

// 1. Create the Context
const AuthContext = createContext();

// 2. Custom Hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 3. The Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (Persist session)
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        // Ideally, you would verify the token with an endpoint like /auth/me
        // For now, we assume if the token exists, the user is an admin
        setUser({ email: 'admin@underrated.com', role: 'admin' });
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  // Login Function
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await API.post('/auth/login', { email, password });
      
      const { token, admin } = response.data;
      
      // Save token and update state
      localStorage.setItem('adminToken', token);
      setUser(admin || { email, role: 'admin' });
      
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;