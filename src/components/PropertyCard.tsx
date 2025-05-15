import React from 'react';
import { Heart } from 'lucide-react';
import { Property } from '../types';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoriteContext';
import { useCurrency } from '../utils/currency';
import { useTranslation } from 'react-i18next';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(property.id);
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      await removeFavorite(property.id);
    } else {
      await addFavorite(property.id);
    }
  };

  const handleCardClick = () => {
    navigate(`/properties/${property.id}`);
  };

  return (
    <div 
      className="group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image container with favorite button */}
      <div className="relative aspect-square overflow-hidden rounded-xl mb-2">
        <img 
          src={property.images[0]} 
          alt={property.title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart 
            size={20} 
            className={favorite ? 'fill-[#FF5A5F] text-[#FF5A5F]' : 'text-gray-700'} 
          />
        </button>
      </div>
      
      {/* Property info */}
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 truncate">{property.location.city}, {property.location.country}</h3>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star fill-gray-900"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>{property.rating}</span>
          </div>
        </div>
        <p className="text-gray-500 truncate">{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</p>
        <p className="text-gray-500 truncate">
          {property.bedroomCount} {property.bedroomCount === 1 ? 'bedroom' : 'bedrooms'} · {property.bathroomCount} {property.bathroomCount === 1 ? 'bath' : 'baths'}
        </p>
        <p className="mt-1">
          <span className="font-semibold">{formatPrice(property.pricePerNight)}</span>
          <span className="text-gray-500"> {t('property.details.perNight')}</span>
        </p>
      </div>
    </div>
  );
}