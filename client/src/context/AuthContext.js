'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.warn('Backend server unreachable:', error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setTimeout(() => fetchUser(token), 0);
    } else {
      setTimeout(() => setLoading(false), 0);
    }
  }, []);



  const login = async (email, password, isAdmin = false) => {
    const url = isAdmin ? 'http://localhost:5000/api/auth/admin/login' : 'http://localhost:5000/api/auth/login';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        router.push('/dashboard');
        return { success: true };
      }
      return { success: false, message: data.message || (data.errors && data.errors[0]?.msg) || 'Login failed' };
    } catch (err) {
      return { success: false, message: 'Server error. Please try again later.' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        router.push('/dashboard');
        return { success: true };
      }
      return { success: false, message: data.message || (data.errors && data.errors[0]?.msg) || 'Registration failed' };
    } catch (err) {
      return { success: false, message: 'Server error. Please try again later.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
