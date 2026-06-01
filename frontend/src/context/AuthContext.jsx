import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await loginUser(credentials);
      const { token: newToken, user: newUser } = res.data.data;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await registerUser(data);
      const { token: newToken, user: newUser } = res.data.data;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      const errors = err.response?.data?.errors || null;
      return { success: false, message, errors };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
