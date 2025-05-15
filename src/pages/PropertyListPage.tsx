import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import { useProperties } from '../context/PropertyContext';
import { MapPin } from 'lucide-react';

export default function PropertyListPage() {
  const location = useLocation();
  const { t } = useTranslation();
  const { filteredProperties, setFilters, loading } = useProperties();
  
  useEffect(() => {
    // Check for query parameters
    const params = new URLSearchParams(location.search);
    const locationParam = params.get('location');
    const typeParam = params.get('type');
    
    // Apply filters if parameters exist
    if (locationParam || typeParam) {
      const filters: any = {};
      if (locationParam) filters.location = locationParam;
      if (typeParam) filters.types = [typeParam];
      setFilters(filters);
    }
  }, [location.search, setFilters]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <PropertyFilters />
      
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5A5F]"></div>
            <p className="mt-4 text-gray-600">{t('common.loading')}</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('property.noResults')}</h2>
            <p className="text-gray-600">{t('property.tryAdjustingFilters')}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredProperties.length} {filteredProperties.length === 1 
                  ? t('property.onePropertyFound') 
                  : t('property.multiplePropertiesFound')}
              </h2>
              
              <div className="flex items-center text-gray-600">
                <MapPin size={20} className="mr-2" />
                <span>{t('property.mapViewComing')}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}