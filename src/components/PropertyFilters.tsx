import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useProperties } from '../context/PropertyContext';
import Button from './ui/Button';
import Input from './ui/Input';
import { Home, Hotel, Mouse as House, Map, Mountain, Palmtree, Tent, Bed, Search, X } from 'lucide-react';
import { useCurrency } from '../utils/currency';

export default function PropertyFilters() {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { propertyTypes, setFilters, clearFilters, loading } = useProperties();
  const [location, setLocation] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [debouncedLocation, setDebouncedLocation] = useState('');

  // Debounce location search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(location);
    }, 300);

    return () => clearTimeout(timer);
  }, [location]);

  // Apply filters when debounced values change
  useEffect(() => {
    handleApplyFilters();
  }, [debouncedLocation, selectedTypes]);

  const typeIcons: Record<string, React.ReactNode> = {
    'apartment': <Home size={24} />,
    'house': <House size={24} />,
    'room': <Bed size={24} />,
    'hotel': <Hotel size={24} />,
    'cabin': <Mountain size={24} />,
    'beach': <Palmtree size={24} />,
    'countryside': <Map size={24} />,
    'camping': <Tent size={24} />
  };

  const handleTypeClick = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  };

  const handlePriceChange = (value: string, type: 'min' | 'max') => {
    const numValue = value === '' ? '' : Math.max(0, parseInt(value));
    setPriceRange(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  const handleApplyFilters = async () => {
    const filters: any = {};
    
    if (selectedTypes.length > 0) {
      filters.types = selectedTypes;
    }
    
    if (debouncedLocation) {
      filters.location = debouncedLocation;
    }
    
    if (priceRange.min !== '') {
      filters.minPrice = parseInt(priceRange.min);
    }
    
    if (priceRange.max !== '') {
      filters.maxPrice = parseInt(priceRange.max);
    }
    
    await setFilters(filters);
  };

  const handleClearFilters = async () => {
    setLocation('');
    setSelectedTypes([]);
    setPriceRange({ min: '', max: '' });
    await clearFilters();
  };

  const isFilterActive = debouncedLocation || selectedTypes.length > 0 || priceRange.min || priceRange.max;

  return (
    <div className="bg-white border-b border-gray-200 py-4 sticky top-16 z-40">
      <div className="container mx-auto px-4">
        {/* Property type filters */}
        <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeClick(type)}
              className={`flex flex-col items-center justify-center min-w-[80px] transition-colors duration-200 ${
                selectedTypes.includes(type) ? 'text-[#FF5A5F] border-b-2 border-[#FF5A5F]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="mb-1">{typeIcons[type]}</div>
              <span className="text-xs capitalize">{t(`property.types.${type}`)}</span>
            </button>
          ))}
        </div>
        
        {/* Advanced filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="relative">
            <Input 
              placeholder={t('property.filters.searchLocation')}
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              leftIcon={<Search size={16} />}
              rightIcon={
                location && (
                  <button 
                    onClick={() => setLocation('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )
              }
            />
          </div>
          
          <div className="flex space-x-2">
            <Input
              placeholder={t('property.filters.minPrice')}
              type="number"
              min="0"
              value={priceRange.min}
              onChange={(e) => handlePriceChange(e.target.value, 'min')}
              onBlur={handleApplyFilters}
              fullWidth
            />
            <Input
              placeholder={t('property.filters.maxPrice')}
              type="number"
              min="0"
              value={priceRange.max}
              onChange={(e) => handlePriceChange(e.target.value, 'max')}
              onBlur={handleApplyFilters}
              fullWidth
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleApplyFilters} 
              variant="primary" 
              fullWidth
              loading={loading}
            >
              {t('property.filters.apply')}
            </Button>
            {isFilterActive && (
              <Button 
                onClick={handleClearFilters} 
                variant="outline" 
                fullWidth
              >
                {t('property.filters.clear')}
              </Button>
            )}
          </div>
        </div>

        {/* Active filters */}
        {isFilterActive && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedTypes.map(type => (
              <div 
                key={type}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {typeIcons[type]}
                <span className="capitalize">{t(`property.types.${type}`)}</span>
                <button 
                  onClick={() => handleTypeClick(type)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {debouncedLocation && (
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Search size={14} />
                <span>{debouncedLocation}</span>
                <button 
                  onClick={() => setLocation('')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {(priceRange.min || priceRange.max) && (
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <span>
                  {priceRange.min ? formatPrice(parseInt(priceRange.min)) : formatPrice(0)} - 
                  {priceRange.max ? formatPrice(parseInt(priceRange.max)) : '∞'}
                </span>
                <button 
                  onClick={() => setPriceRange({ min: '', max: '' })}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}