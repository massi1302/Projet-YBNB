import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Upload, MapPin, Bed, Bath, Users, DollarSign, X } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { PropertyType } from '../types';

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { propertyTypes, addProperty } = useProperties();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as PropertyType,
    location: {
      address: '',
      city: '',
      country: '',
      lat: 0,
      lng: 0,
    },
    images: [] as string[],
    pricePerNight: '',
    bedroomCount: '',
    bathroomCount: '',
    guestCount: '',
    amenities: [] as string[],
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof typeof prev] as object) || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));

    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const propertyData = {
        ...formData,
        images: previewUrls.length > 0 ? previewUrls : ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
        pricePerNight: parseInt(formData.pricePerNight),
        bedroomCount: parseInt(formData.bedroomCount),
        bathroomCount: parseInt(formData.bathroomCount),
        guestCount: parseInt(formData.guestCount),
        hostId: user.id,
        hostName: user.name,
        hostImage: user.image,
        rating: 0,
        reviewCount: 0,
      };

      await addProperty(propertyData);
      navigate('/dashboard/properties');
    } catch (error) {
      console.error('Error adding property:', error);
    } finally {
      setLoading(false);
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.type;
      case 2:
        return formData.location.address && formData.location.city && formData.location.country;
      case 3:
        return true; // Images are optional
      case 4:
        return formData.pricePerNight && formData.bedroomCount && formData.bathroomCount && formData.guestCount;
      case 5:
        return formData.amenities.length > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('becomeHost.steps.basics.title')}</h2>
              <Input
                label={t('becomeHost.steps.basics.propertyTitle')}
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder={t('becomeHost.steps.basics.titlePlaceholder')}
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('becomeHost.steps.basics.description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t('becomeHost.steps.basics.descriptionPlaceholder')}
                className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('becomeHost.steps.basics.propertyType')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {propertyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData(prev => ({ ...prev, type }))}
                    className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${formData.type === type
                      ? 'border-[#FF5A5F] bg-red-50 text-[#FF5A5F]'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Home size={24} />
                    <span className="capitalize">{t(`property.types.${type}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">{t('becomeHost.steps.location.title')}</h2>
            <Input
              label={t('becomeHost.steps.location.streetAddress')}
              name="location.address"
              value={formData.location.address}
              onChange={handleInputChange}
              placeholder={t('becomeHost.steps.location.addressPlaceholder')}
              leftIcon={<MapPin size={16} />}
              fullWidth
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('becomeHost.steps.location.city')}
                name="location.city"
                value={formData.location.city}
                onChange={handleInputChange}
                placeholder={t('becomeHost.steps.location.cityPlaceholder')}
                fullWidth
              />
              <Input
                label={t('becomeHost.steps.location.country')}
                name="location.country"
                value={formData.location.country}
                onChange={handleInputChange}
                placeholder={t('becomeHost.steps.location.countryPlaceholder')}
                fullWidth
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">{t('becomeHost.steps.photos.title')}</h2>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 transition-colors hover:border-[#FF5A5F]"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
              />

              {previewUrls.length === 0 ? (
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-600 text-center mb-4">
                    {t('becomeHost.steps.photos.dragDrop')}
                  </p>
                  <Button variant="outline">
                    {t('becomeHost.steps.photos.selectPhotos')}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                      >
                        <X size={16} className="text-gray-600" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#FF5A5F] transition-colors"
                  >
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">{t('becomeHost.steps.photos.addMore')}</span>
                  </button>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <p>{t('becomeHost.steps.photos.formats')}</p>
              <p>{t('becomeHost.steps.photos.maxSize')}</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">{t('becomeHost.steps.details.title')}</h2>
            <Input
              label={t('becomeHost.steps.details.pricePerNight')}
              name="pricePerNight"
              type="number"
              value={formData.pricePerNight}
              onChange={handleInputChange}
              placeholder={t('becomeHost.steps.details.pricePlaceholder')}
              leftIcon={<DollarSign size={16} />}
              fullWidth
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label={t('becomeHost.steps.details.bedrooms')}
                name="bedroomCount"
                type="number"
                value={formData.bedroomCount}
                onChange={handleInputChange}
                placeholder={t('becomeHost.steps.details.bedroomsPlaceholder')}
                leftIcon={<Bed size={16} />}
                fullWidth
              />
              <Input
                label={t('becomeHost.steps.details.bathrooms')}
                name="bathroomCount"
                type="number"
                value={formData.bathroomCount}
                onChange={handleInputChange}
                placeholder={t('becomeHost.steps.details.bathroomsPlaceholder')}
                leftIcon={<Bath size={16} />}
                fullWidth
              />
              <Input
                label={t('becomeHost.steps.details.maxGuests')}
                name="guestCount"
                type="number"
                value={formData.guestCount}
                onChange={handleInputChange}
                placeholder={t('becomeHost.steps.details.guestsPlaceholder')}
                leftIcon={<Users size={16} />}
                fullWidth
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">{t('becomeHost.steps.amenities.title')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                'Wi-Fi', 'Kitchen', 'Free parking', 'Air conditioning', 'TV',
                'Pool', 'Hot tub', 'Gym', 'Washer', 'Dryer', 'Heating',
                'Workspace', 'BBQ grill', 'Garden', 'Beach access'
              ].map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`p-4 border rounded-lg text-left transition-colors ${formData.amenities.includes(amenity)
                    ? 'border-[#FF5A5F] bg-red-50 text-[#FF5A5F]'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">{t('becomeHost.title')}</h1>
            <div className="text-sm text-gray-500">
              {t('becomeHost.step')} {currentStep} {t('becomeHost.of')} 5
            </div>
          </div>

          <div className="h-2 bg-gray-200 rounded-full mb-8">
            <div
              className="h-full bg-[#FF5A5F] rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          <Card className="mb-8">
            {renderStep()}
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 1}
            >
              {t('becomeHost.previous')}
            </Button>

            {currentStep < 5 ? (
              <Button
                variant="primary"
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!isStepComplete(currentStep)}
              >
                {t('becomeHost.next')}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={loading}
                disabled={!isStepComplete(currentStep)}
              >
                {t('becomeHost.listProperty')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}