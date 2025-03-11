import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  userName: string | null;
  login: (token: string, userName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'));

  const login = (token: string, userName: string) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('userName', userName);
    setToken(token);
    setUserName(userName);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userName');
    setToken(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ token, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}