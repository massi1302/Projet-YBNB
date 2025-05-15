import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Home, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { properties } from '../../data/properties';

// Mock bookings data
const mockBookings = [
  {
    id: 'b1',
    propertyId: '1',
    userId: 'user1',
    checkIn: '2024-04-15',
    checkOut: '2024-04-20',
    guestCount: 2,
    totalPrice: 1000,
    status: 'confirmed',
    createdAt: '2024-03-20T12:00:00Z',
  },
  {
    id: 'b2',
    propertyId: '2',
    userId: 'user1',
    checkIn: '2024-05-01',
    checkOut: '2024-05-05',
    guestCount: 3,
    totalPrice: 1800,
    status: 'pending',
    createdAt: '2024-03-21T12:00:00Z',
  },
  {
    id: 'b3',
    propertyId: '3',
    userId: 'host1',
    checkIn: '2024-04-10',
    checkOut: '2024-04-13',
    guestCount: 4,
    totalPrice: 1050,
    status: 'completed',
    createdAt: '2024-03-19T12:00:00Z',
  },
];

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export default function BookingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>('all');
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <p className="mb-8">You need to be logged in to view your bookings.</p>
          <Button onClick={() => navigate('/login')}>Log In</Button>
        </div>
      </div>
    );
  }

  // Filter bookings based on user role and status
  const userBookings = mockBookings.filter(booking => 
    user.isHost 
      ? properties.some(p => p.hostId === user.id && p.id === booking.propertyId)
      : booking.userId === user.id
  );

  const currentDate = new Date();
  
  const filteredBookings = userBookings.filter(booking => {
    const checkOutDate = new Date(booking.checkOut);
    const isPast = checkOutDate < currentDate;
    
    if (activeTab === 'upcoming' && isPast) return false;
    if (activeTab === 'past' && !isPast) return false;
    if (selectedStatus !== 'all' && booking.status !== selectedStatus) return false;
    
    return true;
  });

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold">My Bookings</h1>
              <p className="text-gray-600">
                {user.isHost ? 'Manage your property bookings' : 'View and manage your trips'}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'upcoming' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming
              </Button>
              <Button
                variant={activeTab === 'past' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('past')}
              >
                Past
              </Button>
            </div>
          </div>

          {/* Status filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedStatus === status
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {filteredBookings.length === 0 ? (
            <Card className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No bookings found</h2>
              <p className="text-gray-600 mb-6">
                {user.isHost
                  ? "You don't have any bookings for your properties yet."
                  : "You haven't made any bookings yet."}
              </p>
              <Button
                variant="primary"
                onClick={() => navigate(user.isHost ? '/dashboard' : '/properties')}
              >
                {user.isHost ? 'View Your Properties' : 'Browse Properties'}
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const property = properties.find(p => p.id === booking.propertyId);
                if (!property) return null;

                return (
                  <Card key={booking.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      {/* Property image */}
                      <div className="sm:w-48 h-48 flex-shrink-0">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Booking details */}
                      <div className="flex-grow p-6">
                        <div className="flex flex-col sm:flex-row justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">{property.title}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin size={16} className="mr-1" />
                              <span>{property.location.city}, {property.location.country}</span>
                            </div>
                          </div>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Check-in</p>
                            <div className="flex items-center mt-1">
                              <Calendar size={16} className="mr-1 text-gray-500" />
                              <span>{formatDate(booking.checkIn)}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Check-out</p>
                            <div className="flex items-center mt-1">
                              <Calendar size={16} className="mr-1 text-gray-500" />
                              <span>{formatDate(booking.checkOut)}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Guests</p>
                            <div className="flex items-center mt-1">
                              <User size={16} className="mr-1 text-gray-500" />
                              <span>{booking.guestCount} guests</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Price</p>
                            <div className="flex items-center mt-1">
                              <span className="font-semibold">${booking.totalPrice}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/properties/${property.id}`)}
                          >
                            View Property
                          </Button>
                          {booking.status === 'pending' && (
                            <>
                              <Button variant="primary">
                                {user.isHost ? 'Accept Booking' : 'Modify Booking'}
                              </Button>
                              <Button variant="danger">
                                Cancel Booking
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}