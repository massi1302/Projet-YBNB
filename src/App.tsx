import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';
import { FavoriteProvider } from './context/FavoriteContext';

// Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PropertyListPage from './pages/PropertyListPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PropertiesPage from './pages/Dashboard/PropertiesPage';
import BookingsPage from './pages/Dashboard/BookingsPage';
import MessagesPage from './pages/Dashboard/MessagesPage';
import SettingsPage from './pages/Dashboard/SettingsPage';
import PaymentPage from './pages/PaymentPage';
import AddPropertyPage from './pages/AddPropertyPage';

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <FavoriteProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<LoginPage />} />
              <Route path="/properties" element={<PropertyListPage />} />
              <Route path="/properties/:id" element={<PropertyDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/properties" element={<PropertiesPage />} />
              <Route path="/dashboard/bookings" element={<BookingsPage />} />
              <Route path="/dashboard/messages" element={<MessagesPage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/become-host" element={<AddPropertyPage />} />
            </Routes>
          </Router>
        </FavoriteProvider>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;