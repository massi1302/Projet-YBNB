import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import { properties } from '../data/properties';
import { useCurrency } from '../utils/currency';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const featuredProperties = properties.slice(0, 3);

  const popularDestinations = [
    { 
      name: 'New York', 
      image: 'https://images.pexels.com/photos/2224861/pexels-photo-2224861.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      propertyCount: properties.filter(p => p.location.city === 'New York').length
    },
    { 
      name: 'Paris', 
      image: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      propertyCount: properties.filter(p => p.location.city === 'Paris').length
    },
    { 
      name: 'Tokyo', 
      image: 'https://images.pexels.com/photos/1749057/pexels-photo-1749057.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      propertyCount: properties.filter(p => p.location.city === 'Tokyo').length
    },
    { 
      name: 'London', 
      image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      propertyCount: properties.filter(p => p.location.city === 'London').length
    },
  ];

  const handleDestinationClick = (destination: string) => {
    navigate(`/properties?location=${encodeURIComponent(destination)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div 
        className="relative h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{ 
          backgroundImage: 'url(https://images.pexels.com/photos/2440471/pexels-photo-2440471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl text-white mb-8">
            {t('home.hero.subtitle')}
          </p>
          
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input 
                type="text" 
                placeholder={t('navigation.searchPlaceholder')}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
              />
              <Button
                onClick={() => navigate('/properties')}
                variant="primary"
                icon={<Search size={18} />}
              >
                {t('navigation.search')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Properties */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">{t('home.featured.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <div 
              key={property.id}
              className="group cursor-pointer rounded-xl overflow-hidden"
              onClick={() => navigate(`/properties/${property.id}`)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={property.images[0]} 
                  alt={property.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-lg">{property.title}</h3>
                <p className="text-gray-600">{property.location.city}, {property.location.country}</p>
                <p className="mt-2">
                  <span className="font-bold">{formatPrice(property.pricePerNight)}</span>
                  {' '}{t('property.details.perNight')}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button
            onClick={() => navigate('/properties')}
            variant="outline"
            size="lg"
          >
            {t('home.featured.browseAll')}
          </Button>
        </div>
      </div>
      
      {/* Destinations Grid */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">{t('home.destinations.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularDestinations.map((destination) => (
              <div 
                key={destination.name}
                className="relative rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => handleDestinationClick(destination.name)}
              >
                <div className="aspect-square">
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                  <p className="text-white font-medium text-lg">{destination.name}</p>
                  <p className="text-white/80 text-sm">
                    {destination.propertyCount} {destination.propertyCount === 1 ? 'property' : 'properties'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Become a Host CTA */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#FF5A5F] rounded-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-8 sm:p-12 text-white flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('home.becomeHost.title')}</h2>
              <p className="text-lg mb-6">{t('home.becomeHost.subtitle')}</p>
              <div>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-[#FF5A5F]"
                >
                  {t('home.becomeHost.learnMore')}
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.pexels.com/photos/5502227/pexels-photo-5502227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Become a host" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.support.title')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">{t('footer.support.helpCenter')}</a></li>
                <li><a href="#" className="hover:underline">{t('footer.support.safety')}</a></li>
                <li><a href="#" className="hover:underline">{t('footer.support.cancellation')}</a></li>
                <li><a href="#" className="hover:underline">{t('footer.support.covid')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.community.title')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">{t('footer.community.disaster')}</a></li>
                <li><a href="#" className="hover:underline">{t('footer.community.refugees')}</a></li>
                <li><a href="#" className="hover:underline">{t('footer.community.discrimination')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.hosting.title')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">{t('footer.hosting.tryHosting')}</a></li>
                <li><a href="#" className="hover:underline">{t('footer.hosting.protection')}</a></li>
                <li><a href="#" className="hover:underline">{t('footer.hosting.resources')}</a></li>
                <li><a href="#" className="hover:underline">{t('footer.hosting.community')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.about.title')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">{t('footer.about.newsroom')}</a></li>
                <li><a href="#" className="hover:underline">{t('footer.about.features')}</a></li>
                <li><a href="#" className="hover:underline">{t('footer.about.careers')}</a></li>
                <li><a href="#" className="hover:underline">{t('footer.about.investors')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p>{t('footer.copyright')}</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-[#FF5A5F]">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-[#FF5A5F]">{t('footer.terms')}</a>
              <a href="#" className="hover:text-[#FF5A5F]">{t('footer.sitemap')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}