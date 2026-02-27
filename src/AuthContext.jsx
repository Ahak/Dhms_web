import React, { createContext, useState, useEffect } from 'react';
import api from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setAuthLoading(false);
        return;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const userResponse = await api.get('/api/users/me/');
        setUser(userResponse.data);
      } catch (error) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login/', { username, password });
      const { access } = response.data;
      localStorage.setItem('token', access);
      setToken(access);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      // Fetch user details
      const userResponse = await api.get('/api/users/me/');
      setUser(userResponse.data);
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await api.post('/api/users/register/', userData);
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthLoading(false);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, authLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
