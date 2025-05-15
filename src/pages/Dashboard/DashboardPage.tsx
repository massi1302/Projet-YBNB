import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, Users, Heart, Clock, MessageSquare, Plus, Settings
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { properties } from '../../data/properties';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

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

  const hostProperties = user.isHost
    ? properties.filter(property => property.hostId === user.id)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">{t('navigation.dashboard')}</h1>
            <p className="text-gray-600">{t('dashboard.welcome')}, {user.name}</p>
          </div>

          {user.isHost && (
            <Button
              variant="primary"
              onClick={() => navigate('/become-host')}
              icon={<Plus size={18} />}
            >
              {t('property.myProperties.addNew')}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: t('dashboard.quickActions.home'), icon: <Home size={20} />, path: '/dashboard' },
            { label: t('dashboard.quickActions.properties'), icon: <Home size={20} />, path: '/dashboard/properties' },
            { label: t('dashboard.quickActions.bookings'), icon: <Clock size={20} />, path: '/dashboard/bookings' },
            { label: t('dashboard.quickActions.favorites'), icon: <Heart size={20} />, path: '/favorites' },
            { label: t('dashboard.quickActions.messages'), icon: <MessageSquare size={20} />, path: '/dashboard/messages' },
            { label: t('dashboard.quickActions.settings'), icon: <Settings size={20} />, path: '/dashboard/settings' },
          ].map((item) => (
            <Card
              key={item.label}
              className="flex flex-col items-center justify-center py-4 transition-colors hover:bg-gray-50"
              onClick={() => navigate(item.path)}
              padding="none"
            >
              <div className="p-2 rounded-full bg-gray-100 mb-2">
                {item.icon}
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </Card>
          ))}
        </div>

        {user.isHost && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <Home size={24} />
                </div>
                <div>
                  <p className="text-gray-500">{t('dashboard.stats.totalProperties')}</p>
                  <h3 className="text-2xl font-bold">{hostProperties.length}</h3>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-gray-500">{t('dashboard.stats.totalBookings')}</p>
                  <h3 className="text-2xl font-bold">12</h3>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <p className="text-gray-500">{t('dashboard.stats.unreadMessages')}</p>
                  <h3 className="text-2xl font-bold">3</h3>
                </div>
              </div>
            </Card>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">{t('dashboard.activity.title')}</h2>
        <Card className="overflow-hidden">
          <div className="divide-y">
            {[
              { title: t('dashboard.activity.booking'), date: `2 ${t('dashboard.activity.timeAgo.hours')}` },
              { title: t('dashboard.activity.message'), date: `1 ${t('dashboard.activity.timeAgo.days')}` },
              { title: t('dashboard.activity.review'), date: `3 ${t('dashboard.activity.timeAgo.days')}` },
            ].map((activity, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                  <button className="text-[#FF5A5F] hover:underline text-sm">
                    {t('dashboard.activity.viewAll')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {user.isHost && hostProperties.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">{t('dashboard.hostProperties.title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostProperties.map((property) => (
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
                      <span className="text-gray-500"> {t('property.details.perNight')}</span>
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/properties/${property.id}`)}
                        className="flex-1"
                      >
                        {t('dashboard.hostProperties.viewProperty')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/dashboard/properties/${property.id}`)}
                        className="flex-1"
                      >
                        {t('dashboard.hostProperties.editProperty')}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}