import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import Header from '../components/Header';
import PropertyCard from '../components/PropertyCard';
import { useFavorites } from '../context/FavoriteContext';
import { useAuth } from '../context/AuthContext';
import { properties } from '../data/properties';
import Button from '../components/ui/Button';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { favorites } = useFavorites();

  const favoriteProperties = properties.filter(property =>
    favorites.some(favorite => favorite.propertyId === property.id)
  );

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('auth.login')}</h1>
          <p className="mb-8">{t('favorites.loginRequired')}</p>
          <Button onClick={() => navigate('/login')}>{t('auth.login')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">{t('favorites.title')}</h1>

        {favoriteProperties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="mb-4 flex justify-center">
              <Heart size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              {t('favorites.noFavorites')}
            </h2>
            <p className="text-gray-600 mb-8">
              {t('favorites.noFavoritesDescription')}
            </p>
            <Button onClick={() => navigate('/properties')}>
              {t('favorites.browseProperties')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}