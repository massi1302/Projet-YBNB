import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PropertyCard from '../components/PropertyCard';
import { useFavorites } from '../context/FavoriteContext';
import { useAuth } from '../context/AuthContext';
import { properties } from '../data/properties';
import Button from '../components/ui/Button';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites } = useFavorites();
  
  // Filter properties to only show favorites
  const favoriteProperties = properties.filter(property => 
    favorites.some(favorite => favorite.propertyId === property.id)
  );
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <p className="mb-8">You need to be logged in to view your favorites.</p>
          <Button onClick={() => navigate('/login')}>Log In</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Saved Properties</h1>
        
        {favoriteProperties.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-medium text-gray-900 mb-4">No favorites yet</h2>
            <p className="text-gray-600 mb-8">Find homes you'll love and save them to your favorites.</p>
            <Button onClick={() => navigate('/properties')}>Browse Properties</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}