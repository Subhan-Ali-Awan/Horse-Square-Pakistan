import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [initializing, setInitializing] = useState(true); // true until auth is restored

  const sanitizeUser = (u) => {
    if (!u) return u;
    if (u.firstName === 'Super' || u.name === 'Super Admin' || u.name === 'Super' || (u.firstName + ' ' + (u.lastName || '')).trim() === 'Super Admin') {
      return {
        ...u,
        firstName: 'Admin',
        lastName: u.lastName === 'Admin' ? '' : (u.lastName || ''),
        name: 'Admin'
      };
    }
    return u;
  };

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const res = await fetch(getApiUrl('/api/auth/me'), {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.user) {
              const cleaned = sanitizeUser(data.user);
              setToken(storedToken);
              setUser(cleaned);
              localStorage.setItem('user', JSON.stringify(cleaned));
            } else {
              logout();
            }
          } else if (res.status === 401 || res.status === 403) {
            logout();
          } else {
            // Temporary server cold start or gateway error -> maintain cached user session
            try {
              const parsed = JSON.parse(storedUser);
              const cleaned = sanitizeUser(parsed);
              setToken(storedToken);
              setUser(cleaned);
            } catch (err) {
              logout();
            }
          }
        } catch (e) {
          console.error('Error verifying stored auth:', e);
          try {
            const parsed = JSON.parse(storedUser);
            const cleaned = sanitizeUser(parsed);
            setToken(storedToken);
            setUser(cleaned);
          } catch (err) {
            logout();
          }
        }
      } else {
        setUser(null);
        setToken('');
      }
      setInitializing(false);
    };

    verifyAuth();
  }, []);

  const login = (newToken, userData) => {
    const cleaned = sanitizeUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(cleaned));
    setToken(newToken);
    setUser(cleaned);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
