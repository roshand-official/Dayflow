import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('dayflow_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await client.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user session', error);
      localStorage.removeItem('dayflow_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const response = await client.post('/auth/login', { email, password });
    const { access_token, user: userData } = response.data;
    localStorage.setItem('dayflow_token', access_token);
    
    // Fetch full profile info with employee details
    const meResponse = await client.get('/auth/me');
    setUser(meResponse.data);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('dayflow_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
