import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'manager' | 'storekeeper';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'manager@commodities.com': {
    password: 'manager123',
    user: {
      id: '1',
      email: 'manager@commodities.com',
      name: 'John Manager',
      role: 'manager',
    },
  },
  'keeper@commodities.com': {
    password: 'keeper123',
    user: {
      id: '2',
      email: 'keeper@commodities.com',
      name: 'Jane Keeper',
      role: 'storekeeper',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('commodities_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('commodities_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockUser = MOCK_USERS[email.toLowerCase()];
    
    if (!mockUser) {
      setIsLoading(false);
      return { success: false, error: 'User not found. Try manager@commodities.com or keeper@commodities.com' };
    }
    
    if (mockUser.password !== password) {
      setIsLoading(false);
      return { success: false, error: 'Invalid password' };
    }
    
    setUser(mockUser.user);
    localStorage.setItem('commodities_user', JSON.stringify(mockUser.user));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('commodities_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
