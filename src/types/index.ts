export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  isHost: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  location: {
    city: string;
    country: string;
    address: string;
    lat: number;
    lng: number;
  };
  images: string[];
  pricePerNight: number;
  bedroomCount: number;
  bathroomCount: number;
  guestCount: number;
  amenities: string[];
  hostId: string;
  hostName: string;
  hostImage?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export type PropertyType = 
  | 'apartment' 
  | 'house' 
  | 'room' 
  | 'hotel' 
  | 'cabin' 
  | 'beach' 
  | 'countryside' 
  | 'camping';

export interface Booking {
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

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
}