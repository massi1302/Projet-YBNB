import React, { createContext, useState, useContext, useEffect } from 'react';
import { Favorite } from '../types';
import { useAuth } from './AuthContext';

interface FavoriteContextType {
  favorites: Favorite[];
  loading: boolean;
  addFavorite: (propertyId: string) => Promise<boolean>;
  removeFavorite: (propertyId: string) => Promise<boolean>;
  isFavorite: (propertyId: string) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Load favorites from localStorage
      const savedFavorites = localStorage.getItem(`airbnb_favorites_${user.id}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  const addFavorite = async (propertyId: string): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newFavorite: Favorite = {
      id: `fav${Date.now()}`,
      userId: user.id,
      propertyId,
      createdAt: new Date().toISOString()
    };
    
    const updatedFavorites = [...favorites, newFavorite];
    setFavorites(updatedFavorites);
    localStorage.setItem(`airbnb_favorites_${user.id}`, JSON.stringify(updatedFavorites));
    
    setLoading(false);
    return true;
  };

  const removeFavorite = async (propertyId: string): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedFavorites = favorites.filter(fav => fav.propertyId !== propertyId);
    setFavorites(updatedFavorites);
    localStorage.setItem(`airbnb_favorites_${user.id}`, JSON.stringify(updatedFavorites));
    
    setLoading(false);
    return true;
  };

  const isFavorite = (propertyId: string): boolean => {
    if (!user) return false;
    return favorites.some(fav => fav.propertyId === propertyId);
  };

  return (
    <FavoriteContext.Provider value={{ favorites, loading, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}