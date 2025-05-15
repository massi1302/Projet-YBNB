import { User } from '../types';

// Mock users data
export const users: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isHost: false,
  },
  {
    id: 'host1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isHost: true,
  },
  {
    id: 'host2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isHost: true,
  },
  {
    id: 'user2',
    name: 'Emily Wilson',
    email: 'emily@example.com',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    isHost: false,
  },
];