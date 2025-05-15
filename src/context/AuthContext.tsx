import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { users } from '../data/users';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved auth in localStorage
    const savedUser = localStorage.getItem('airbnb_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('airbnb_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const userExists = users.some(u => u.email === email);
    if (userExists) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user (in a real app, this would be done on the server)
    const newUser: User = {
      id: `user${users.length + 1}`,
      name,
      email,
      isHost: false,
    };
    
    // In a real app, we would add the user to the database here
    setUser(newUser);
    localStorage.setItem('airbnb_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('airbnb_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
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