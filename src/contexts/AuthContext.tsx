import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    phone: '+55 11 99999-9999',
    role: 'user',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'admin',
    name: 'Administrador',
    email: 'admin@investbot.com',
    role: 'admin',
    createdAt: new Date('2024-01-01')
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('investbot-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials
    if (email === 'demo@investbot.com' && password === 'demo123') {
      const demoUser = mockUsers[0];
      setUser(demoUser);
      localStorage.setItem('investbot-user', JSON.stringify(demoUser));
    } else if (email === 'admin@investbot.com' && password === 'admin123') {
      const adminUser = mockUsers[1];
      setUser(adminUser);
      localStorage.setItem('investbot-user', JSON.stringify(adminUser));
    } else {
      throw new Error('Credenciais inválidas');
    }
    
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user',
      createdAt: new Date()
    };
    
    setUser(newUser);
    localStorage.setItem('investbot-user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('investbot-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};