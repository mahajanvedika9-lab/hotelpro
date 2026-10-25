import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Pre-seed with default logged in Admin or guest for ease of testing
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hotelpro_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default demo user is Admin so the user can immediately experience all full-suite features
    return {
      _id: 'seed-admin-01',
      name: 'Victoria Stone',
      email: 'admin@hotelpro.com',
      role: 'admin',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    };
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('hotelpro_token') || 'demo-jwt-token-hotelpro';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('hotelpro_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hotelpro_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('hotelpro_token', token);
    } else {
      localStorage.removeItem('hotelpro_token');
    }
  }, [token]);

  // One-click demo role switcher for mentors, evaluators, and users
  const switchDemoRole = (newRole) => {
    if (newRole === 'admin') {
      setUser({
        _id: 'seed-admin-01',
        name: 'Victoria Stone',
        email: 'admin@hotelpro.com',
        role: 'admin',
        phone: '+1 (555) 234-5678',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      });
      setToken('demo-admin-jwt-token');
    } else if (newRole === 'staff') {
      setUser({
        _id: 'seed-staff-01',
        name: 'Marcus Vance',
        email: 'staff@hotelpro.com',
        role: 'staff',
        phone: '+1 (555) 876-5432',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      });
      setToken('demo-staff-jwt-token');
    } else {
      setUser({
        _id: 'seed-guest-01',
        name: 'Sophia Montgomery',
        email: 'guest@hotelpro.com',
        role: 'guest',
        phone: '+1 (555) 432-1098',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      });
      setToken('demo-guest-jwt-token');
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const register = async (name, email, password, role = 'guest', phone = '', adminSecretKey = '') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, phone, adminSecretKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hotelpro_user');
    localStorage.removeItem('hotelpro_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        switchDemoRole,
        isAdmin: user?.role === 'admin',
        isStaff: user?.role === 'staff' || user?.role === 'admin',
        isGuest: user?.role === 'guest',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
