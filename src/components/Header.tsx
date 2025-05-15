import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, UserCircle, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?location=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBecomeHost = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/become-host');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-8 h-8 text-[#FF5A5F]"
            >
              <path d="M2 20v-8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8" />
              <path d="M18 11V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v7" />
              <rect width="18" height="10" x="3" y="14" rx="2" />
            </svg>
            <span className="ml-2 text-2xl font-bold text-[#FF5A5F] hidden sm:inline-block">Ybnb</span>
          </Link>
          
          {/* Search */}
          <form 
            onSubmit={handleSearch}
            className="hidden sm:flex items-center border rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-shadow duration-200 w-full max-w-md"
          >
            <input
              type="text"
              placeholder={t('navigation.searchPlaceholder')}
              className="flex-grow border-none focus:ring-0 focus:outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-[#FF5A5F] p-2 rounded-full text-white disabled:opacity-50"
              disabled={!searchQuery.trim()}
            >
              <Search size={16} />
            </button>
          </form>
          
          {/* Right section */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleBecomeHost}
              variant="outline"
              className="hidden sm:flex"
            >
              {t('navigation.becomeHost')}
            </Button>
            
            {/* User menu */}
            <div className="relative">
              <button 
                onClick={toggleMenu}
                className="flex items-center space-x-2 border rounded-full p-2 hover:shadow-md transition-shadow duration-200"
              >
                <Menu size={18} />
                <div className="hidden sm:block">
                  {user ? (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="w-full h-full text-gray-500" />
                      )}
                    </div>
                  ) : (
                    <UserCircle size={24} />
                  )}
                </div>
              </button>
              
              {/* Dropdown menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200">
                  <div className="py-1">
                    {user ? (
                      <>
                        <p className="px-4 py-2 text-sm text-gray-700 border-b">
                          {user.name}
                        </p>
                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          {t('navigation.dashboard')}
                        </Link>
                        <Link to="/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          {t('navigation.favorites')}
                        </Link>
                        {user.isHost && (
                          <Link to="/dashboard/properties" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            {t('navigation.myListings')}
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            signOut();
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {t('auth.logout')}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          to="/login" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t('auth.login')}
                        </Link>
                        <Link 
                          to="/signup" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t('auth.signup')}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile search */}
      <div className="sm:hidden px-4 pb-4">
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            placeholder={t('navigation.searchPlaceholder')}
            className="flex-grow border rounded-l-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-[#FF5A5F] px-4 py-2 rounded-r-full text-white disabled:opacity-50"
            disabled={!searchQuery.trim()}
          >
            <Search size={16} />
          </button>
        </form>
      </div>
    </header>
  );
}