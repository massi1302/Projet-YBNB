import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Home, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useProperties } from '../../context/PropertyContext';

export default function PropertiesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { properties, deleteProperty } = useProperties();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('auth.login')}</h1>
          <p className="mb-8">{t('settings.loginRequired')}</p>
          <Button onClick={() => navigate('/login')}>{t('auth.login')}</Button>
        </div>
      </div>
    );
  }

  // Get properties for this host
  const userProperties = properties.filter(property => property.hostId === user.id);

  const handleDelete = async (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setDeletingId(propertyId);
      try {
        await deleteProperty(propertyId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">{t('property.myProperties.title')}</h1>
            <p className="text-gray-600">{t('property.myProperties.subtitle')}</p>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate('/become-host')}
            icon={<Plus size={18} />}
          >
            {t('property.myProperties.addNew')}
          </Button>
        </div>

        {userProperties.length === 0 ? (
          <Card className="text-center py-12">
            <Home size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t('property.myProperties.noProperties')}</h2>
            <p className="text-gray-600 mb-6">{t('property.myProperties.noPropertiesDescription')}</p>
            <Button
              variant="primary"
              onClick={() => navigate('/become-host')}
              icon={<Plus size={18} />}
            >
              {t('property.myProperties.addFirst')}
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold truncate">{property.title}</h3>
                  <p className="text-gray-500 truncate">{property.location.city}, {property.location.country}</p>
                  <p className="mt-2">
                    <span className="font-bold">${property.pricePerNight}</span>
                    <span className="text-gray-500"> {t('property.myProperties.perNight')}</span>
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{property.bedroomCount} {t('property.myProperties.beds')}</span>
                      <span className="mx-2">·</span>
                      <span>{property.bathroomCount} {t('property.myProperties.baths')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/properties/${property.id}`)}
                      >
                        {t('common.view')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/dashboard/properties/${property.id}/edit`)}
                      >
                        {t('common.edit')}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(property.id)}
                        loading={deletingId === property.id}
                        icon={<Trash2 size={16} />}
                      >
                        {t('common.delete')}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}