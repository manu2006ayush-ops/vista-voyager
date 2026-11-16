import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vv_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('vv_token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.data);
          localStorage.setItem('vv_user', JSON.stringify(data.data));
        } catch (err) {
          localStorage.removeItem('vv_token');
          localStorage.removeItem('vv_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    bootstrap();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('vv_token', data.data.token);
    localStorage.setItem('vv_user', JSON.stringify(data.data));
    setUser(data.data);
    toast.success(`Welcome back, ${data.data.name.split(' ')[0]}!`);
    return data.data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('vv_token', data.data.token);
    localStorage.setItem('vv_user', JSON.stringify(data.data));
    setUser(data.data);
    toast.success(`Welcome to Vista Voyager, ${data.data.name.split(' ')[0]}!`);
    return data.data;
  };

  const logout = () => {
    localStorage.removeItem('vv_token');
    localStorage.removeItem('vv_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUserLocal = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
    localStorage.setItem('vv_user', JSON.stringify({ ...user, ...updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserLocal, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
