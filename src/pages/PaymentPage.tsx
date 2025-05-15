import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, User, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { properties } from '../data/properties';
import { useAuth } from '../context/AuthContext';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });
  
  // Get booking details from location state
  const bookingDetails = location.state || {};
  const property = properties.find(p => p.id === bookingDetails.propertyId);
  
  if (!property || !bookingDetails.totalPrice) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid booking</h1>
          <p className="mb-8">The booking details are missing or invalid. Please try again.</p>
          <Button onClick={() => navigate('/properties')}>Browse Properties</Button>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in</h1>
          <p className="mb-8">You need to be logged in to make a booking.</p>
          <Button onClick={() => navigate('/login')}>Log In</Button>
        </div>
      </div>
    );
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.cardName || !formData.cardNumber || !formData.expiryDate || !formData.cvc) {
      alert('Please fill in all payment details');
      return;
    }
    
    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      // 90% chance of success for demo purposes
      const success = Math.random() < 0.9;
      
      if (success) {
        setPaymentStatus('success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setPaymentStatus('error');
      }
    }, 2000);
  };
  
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <Card className="w-full max-w-md text-center p-8">
            <div className="mb-4 flex justify-center">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Your booking has been confirmed. We've sent a confirmation email to your inbox.
            </p>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  if (paymentStatus === 'error') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <Card className="w-full max-w-md text-center p-8">
            <div className="mb-4 flex justify-center">
              <AlertCircle size={64} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again with a different payment method.
            </p>
            <Button variant="primary" onClick={() => setPaymentStatus('idle')}>
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Complete your booking</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment form */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <Input
                    label="Name on card"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    leftIcon={<User size={16} />}
                    fullWidth
                  />
                  
                  <Input
                    label="Card number"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    leftIcon={<CreditCard size={16} />}
                    fullWidth
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      leftIcon={<Calendar size={16} />}
                    />
                    
                    <Input
                      label="CVC"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      type="password"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      fullWidth 
                      loading={paymentStatus === 'processing'}
                    >
                      {paymentStatus === 'processing' ? 'Processing...' : 'Complete Booking'}
                    </Button>
                  </div>
                </div>
              </form>
            </Card>
          </div>
          
          {/* Booking summary */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-xl font-semibold mb-6">Booking Summary</h2>
              
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={property.images[0]} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{property.title}</h3>
                  <p className="text-gray-600 text-sm">{property.location.city}, {property.location.country}</p>
                </div>
              </div>
              
              <div className="border-t border-b py-4 mb-4">
                <div className="flex items-center mb-2">
                  <Calendar size={16} className="mr-2 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium">{bookingDetails.checkIn || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium">{bookingDetails.checkOut || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <p>${property.pricePerNight} x 3 nights</p>
                  <p>${property.pricePerNight * 3}</p>
                </div>
                <div className="flex justify-between">
                  <p>Cleaning fee</p>
                  <p>$60</p>
                </div>
                <div className="flex justify-between">
                  <p>Service fee</p>
                  <p>$45</p>
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t font-bold">
                <p>Total</p>
                <p>${bookingDetails.totalPrice}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}