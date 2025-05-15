import React, { createContext, useState, useContext } from 'react';
import { Property, PropertyType } from '../types';
import { properties as mockProperties } from '../data/properties';

interface PropertyFilters {
  types?: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

interface PropertyContextType {
  properties: Property[];
  filteredProperties: Property[];
  propertyTypes: PropertyType[];
  loading: boolean;
  setFilters: (filters: PropertyFilters) => void;
  clearFilters: () => void;
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => Promise<Property>;
  deleteProperty: (propertyId: string) => Promise<boolean>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [filters, setFiltersState] = useState<PropertyFilters>({});
  const [loading, setLoading] = useState(false);

  const propertyTypes: PropertyType[] = [
    'apartment', 'house', 'room', 'hotel', 'cabin', 'beach', 'countryside', 'camping'
  ];

  const setFilters = async (newFilters: PropertyFilters) => {
    setLoading(true);
    setFiltersState(newFilters);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const clearFilters = async () => {
    setLoading(true);
    setFiltersState({});
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const filteredProperties = properties.filter(property => {
    if (filters.types?.length && !filters.types.includes(property.type)) {
      return false;
    }

    if (filters.minPrice && property.pricePerNight < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && property.pricePerNight > filters.maxPrice) {
      return false;
    }

    if (filters.location) {
      const searchTerm = filters.location.toLowerCase();
      const cityMatch = property.location.city.toLowerCase().includes(searchTerm);
      const countryMatch = property.location.country.toLowerCase().includes(searchTerm);
      const addressMatch = property.location.address.toLowerCase().includes(searchTerm);
      if (!cityMatch && !countryMatch && !addressMatch) {
        return false;
      }
    }

    return true;
  });

  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt'>): Promise<Property> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newProperty: Property = {
      ...propertyData,
      id: `property${properties.length + 1}`,
      createdAt: new Date().toISOString(),
    };

    setProperties([...properties, newProperty]);
    setLoading(false);
    return newProperty;
  };

  const deleteProperty = async (propertyId: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setProperties(properties.filter(p => p.id !== propertyId));
    setLoading(false);
    return true;
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        propertyTypes,
        loading,
        setFilters,
        clearFilters,
        addProperty,
        deleteProperty
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
}