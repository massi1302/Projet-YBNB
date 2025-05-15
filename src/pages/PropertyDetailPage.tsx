import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, Star, Share, Heart, User, Home, Wifi, Car, Wind, 
  Coffee, Tv, ShowerHead, Calendar
} from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { properties } from '../data/properties';
import { useFavorites } from '../context/FavoriteContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../utils/currency';

export default function PropertyDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = properties.find(p => p.id === id);
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { formatPrice } = useCurrency();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [message, setMessage] = useState('');
  
  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('property.notFound')}</h1>
          <p className="mb-8">{t('property.notFoundDescription')}</p>
          <Button onClick={() => navigate('/properties')}>{t('property.browseAll')}</Button>
        </div>
      </div>
    );
  }
  
  const favorite = isFavorite(property.id);
  
  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (favorite) {
      await removeFavorite(property.id);
    } else {
      await addFavorite(property.id);
    }
  };
  
  const handleSendMessage = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    alert(`Message sent to ${property.hostName}: "${message}"`);
    setMessage('');
  };
  
  const handleBooking = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!checkIn || !checkOut) {
      alert(t('property.details.selectDates'));
      return;
    }
    
    navigate('/payment', { 
      state: { 
        propertyId: property.id,
        checkIn,
        checkOut,
        guests,
        totalPrice: property.pricePerNight * 3 // Just an example calculation
      } 
    });
  };
  
  const amenitiesIcons: Record<string, React.ReactNode> = {
    'Wi-Fi': <Wifi size={20} />,
    'Kitchen': <Coffee size={20} />,
    'Free parking': <Car size={20} />,
    'Air conditioning': <Wind size={20} />,
    'TV': <Tv size={20} />,
    'Pool': <ShowerHead size={20} />,
  };
  
  const displayedAmenities = showAllAmenities 
    ? property.amenities 
    : property.amenities.slice(0, 6);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{property.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-[#FF5A5F] fill-[#FF5A5F]" />
            <span className="ml-1 font-medium">{property.rating}</span>
            <span className="mx-1">·</span>
            <span className="text-gray-700">{property.reviewCount} {t('property.details.reviews')}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <MapPin className="w-5 h-5" />
            <span className="ml-1">{property.location.city}, {property.location.country}</span>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <button className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-100">
              <Share className="w-4 h-4" />
              <span>{t('common.share')}</span>
            </button>
            
            <button 
              className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-100"
              onClick={handleFavoriteToggle}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-[#FF5A5F] text-[#FF5A5F]' : ''}`} />
              <span>{t('common.save')}</span>
            </button>
          </div>
        </div>
        
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
          <div className="md:col-span-1 aspect-square overflow-hidden rounded-lg">
            <img 
              src={property.images[selectedImageIndex]} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="hidden md:grid md:grid-cols-2 gap-2">
            {property.images.slice(0, 4).map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg">
                <img 
                  src={image} 
                  alt={`${property.title} - ${index + 1}`} 
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                  onClick={() => setSelectedImageIndex(index)}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Thumbnails for mobile */}
        <div className="flex md:hidden gap-2 overflow-x-auto pb-4 mb-4">
          {property.images.map((image, index) => (
            <div 
              key={index} 
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                selectedImageIndex === index ? 'border-[#FF5A5F]' : 'border-transparent'
              }`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img 
                src={image} 
                alt={`Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start pb-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">
                  {property.type.charAt(0).toUpperCase() + property.type.slice(1)} {t('property.details.hosted')} {property.hostName}
                </h2>
                <p className="text-gray-700">
                  {property.bedroomCount} {property.bedroomCount === 1 ? t('property.details.bedroom') : t('property.details.bedrooms')} · 
                  {' '}{property.bathroomCount} {property.bathroomCount === 1 ? t('property.details.bathroom') : t('property.details.bathrooms')} · 
                  {' '}{t('property.details.upTo')} {property.guestCount} {t('property.details.guests')}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                {property.hostImage ? (
                  <img 
                    src={property.hostImage} 
                    alt={property.hostName} 
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={24} className="text-gray-500" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Description */}
            <div className="py-6 border-b">
              <h2 className="text-xl font-semibold mb-4">{t('property.details.description')}</h2>
              <p className="text-gray-700">{property.description}</p>
            </div>
            
            {/* Amenities */}
            <div className="py-6 border-b">
              <h2 className="text-xl font-semibold mb-4">{t('property.details.amenities')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                {displayedAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <div className="text-gray-700">
                      {amenitiesIcons[amenity] || <Home size={20} />}
                    </div>
                    <span className="ml-3">{amenity}</span>
                  </div>
                ))}
              </div>
              
              {property.amenities.length > 6 && (
                <button 
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="mt-4 px-4 py-2 border border-gray-800 rounded-md font-medium hover:bg-gray-100"
                >
                  {showAllAmenities ? t('common.showLess') : t('common.showMore')}
                </button>
              )}
            </div>
            
            {/* Location */}
            <div className="py-6 border-b">
              <h2 className="text-xl font-semibold mb-4">{t('property.details.location')}</h2>
              <p className="text-gray-700 mb-4">{property.location.address}, {property.location.city}, {property.location.country}</p>
              <div className="aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden">
                {/* Placeholder for a map - in a real app, we would include an actual map */}
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin size={48} className="text-gray-400" />
                  <p className="ml-2 text-gray-600">{t('property.details.mapPlaceholder')}</p>
                </div>
              </div>
            </div>
            
            {/* Host information and messaging */}
            <div className="py-6">
              <h2 className="text-xl font-semibold mb-4">{t('property.details.hosted')} {property.hostName}</h2>
              <div className="flex items-start gap-4">
                {property.hostImage ? (
                  <img 
                    src={property.hostImage} 
                    alt={property.hostName} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={28} className="text-gray-500" />
                  </div>
                )}
                
                <div>
                  <p className="text-gray-700 mb-4">{t('property.details.contactHostMessage')}</p>
                  <div className="space-y-2">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t('property.details.messagePlaceholder')}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] min-h-[100px]"
                    />
                    <Button onClick={handleSendMessage} disabled={!message.trim()}>
                      {t('property.details.sendMessage')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xl font-bold">
                    {formatPrice(property.pricePerNight)}
                    {' '}<span className="text-gray-600 font-normal">{t('property.details.perNight')}</span>
                  </p>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-[#FF5A5F] fill-[#FF5A5F]" />
                  <span className="ml-1">{property.rating}</span>
                  <span className="mx-1">·</span>
                  <span className="text-gray-600">{property.reviewCount} {t('property.details.reviews')}</span>
                </div>
              </div>
              
              <div className="border border-gray-300 rounded-md overflow-hidden mb-4">
                <div className="grid grid-cols-2">
                  <div className="p-3 border-r border-b">
                    <label className="block text-xs font-semibold mb-1">{t('property.details.checkIn').toUpperCase()}</label>
                    <input 
                      type="date" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full border-none p-0 focus:ring-0"
                    />
                  </div>
                  <div className="p-3 border-b">
                    <label className="block text-xs font-semibold mb-1">{t('property.details.checkOut').toUpperCase()}</label>
                    <input 
                      type="date" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full border-none p-0 focus:ring-0"
                    />
                  </div>
                </div>
                <div className="p-3">
                  <label className="block text-xs font-semibold mb-1">{t('property.details.guests').toUpperCase()}</label>
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full border-none p-0 focus:ring-0"
                  >
                    {[...Array(property.guestCount)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1} {i === 0 ? t('property.details.guest') : t('property.details.guests')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleBooking}
                icon={<Calendar size={18} />}
              >
                {t('property.details.reserve')}
              </Button>
              
              <p className="text-center text-gray-500 mt-2">{t('property.details.noCharge')}</p>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <p>{formatPrice(property.pricePerNight)} x 3 {t('property.details.nights')}</p>
                  <p>{formatPrice(property.pricePerNight * 3)}</p>
                </div>
                <div className="flex justify-between">
                  <p>{t('property.details.cleaningFee')}</p>
                  <p>{formatPrice(60)}</p>
                </div>
                <div className="flex justify-between">
                  <p>{t('property.details.serviceFee')}</p>
                  <p>{formatPrice(45)}</p>
                </div>
                <div className="flex justify-between pt-4 border-t font-bold">
                  <p>{t('property.details.total')}</p>
                  <p>{formatPrice(property.pricePerNight * 3 + 60 + 45)}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}