import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Users, Heart, Clock, MessageSquare, Plus, Settings 
} from 'lucide-react';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { properties } from '../../data/properties';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <p className="mb-8">You need to be logged in to view your dashboard.</p>
          <Button onClick={() => navigate('/login')}>Log In</Button>
        </div>
      </div>
    );
  }
  
  // Get properties for this host if user is a host
  const hostProperties = user.isHost 
    ? properties.filter(property => property.hostId === user.id)
    : [];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}</p>
          </div>
          
          {user.isHost && (
            <Button 
              variant="primary" 
              onClick={() => navigate('/dashboard/properties/new')}
              icon={<Plus size={18} />}
            >
              Add New Property
            </Button>
          )}
        </div>
        
        {/* Dashboard navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Home', icon: <Home size={20} />, path: '/dashboard' },
            { label: 'Properties', icon: <Home size={20} />, path: '/dashboard/properties' },
            { label: 'Bookings', icon: <Clock size={20} />, path: '/dashboard/bookings' },
            { label: 'Favorites', icon: <Heart size={20} />, path: '/favorites' },
            { label: 'Messages', icon: <MessageSquare size={20} />, path: '/dashboard/messages' },
            { label: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
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
        
        {/* Host stats - only visible to hosts */}
        {user.isHost && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <Home size={24} />
                </div>
                <div>
                  <p className="text-gray-500">Total Properties</p>
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
                  <p className="text-gray-500">Total Bookings</p>
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
                  <p className="text-gray-500">Unread Messages</p>
                  <h3 className="text-2xl font-bold">3</h3>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* Recent activity */}
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <Card className="overflow-hidden">
          <div className="divide-y">
            {[
              { title: 'New booking request', date: '2 hours ago', type: 'booking' },
              { title: 'Message from Sarah', date: '1 day ago', type: 'message' },
              { title: 'New property review', date: '3 days ago', type: 'review' },
            ].map((activity, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                  <button className="text-[#FF5A5F] hover:underline text-sm">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Host properties - only visible to hosts */}
        {user.isHost && hostProperties.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Your Properties</h2>
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
                    <p className="mt-2"><span className="font-bold">${property.pricePerNight}</span> / night</p>
                    <div className="mt-4 flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/properties/${property.id}`)}
                        className="flex-1"
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/dashboard/properties/${property.id}`)}
                        className="flex-1"
                      >
                        Edit
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