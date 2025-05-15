import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  User, Lock, Bell, CreditCard, Globe, Briefcase, 
  FileText, Building2, Shield, Mail, Phone, MapPin,
  Camera, LogOut, Trash2, Languages
} from 'lucide-react';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import LanguageSelector from '../../components/LanguageSelector';
import { useAuth } from '../../context/AuthContext';

type SettingsSection = 
  | 'personal'
  | 'security'
  | 'notifications'
  | 'payments'
  | 'language'
  | 'travel'
  | 'hosting'
  | 'taxes';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<SettingsSection>('personal');
  const [loading, setLoading] = useState(false);

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

  const navigationItems: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [
    { id: 'personal', label: t('settings.personalInfo'), icon: <User size={20} /> },
    { id: 'security', label: t('settings.security'), icon: <Lock size={20} /> },
    { id: 'notifications', label: t('settings.notifications'), icon: <Bell size={20} /> },
    { id: 'payments', label: t('settings.payments'), icon: <CreditCard size={20} /> },
    { id: 'language', label: t('settings.language'), icon: <Languages size={20} /> },
    { id: 'travel', label: t('settings.travel'), icon: <Briefcase size={20} /> },
    { id: 'taxes', label: 'Taxes', icon: <FileText size={20} /> },
    { id: 'hosting', label: t('settings.hosting'), icon: <Building2 size={20} /> },
  ];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(t('settings.deleteConfirmation'))) {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      await signOut();
      navigate('/');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                {user.image ? (
                  <img 
                    src={user.image} 
                    alt={user.name} 
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                  <Camera size={20} />
                </button>
              </div>
              
              <div className="flex-grow">
                <h2 className="text-xl font-semibold mb-4">{t('settings.profileInfo')}</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <Input
                    label={t('settings.fullName')}
                    defaultValue={user.name}
                    leftIcon={<User size={16} />}
                    fullWidth
                  />
                  
                  <Input
                    label={t('auth.email')}
                    type="email"
                    defaultValue={user.email}
                    leftIcon={<Mail size={16} />}
                    fullWidth
                  />
                  
                  <Input
                    label={t('settings.phone')}
                    type="tel"
                    placeholder={t('settings.addPhone')}
                    leftIcon={<Phone size={16} />}
                    fullWidth
                  />
                  
                  <Input
                    label={t('settings.address')}
                    placeholder={t('settings.addAddress')}
                    leftIcon={<MapPin size={16} />}
                    fullWidth
                  />
                  
                  <Button type="submit" loading={loading}>
                    {t('common.save')}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">{t('settings.language')}</h2>
            <LanguageSelector />
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Login & Security</h2>
              <Card>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-gray-500">Last updated 30 days ago</p>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>
                  
                  <div className="flex justify-between items-center pb-4 border-b">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Connected Accounts</h3>
                      <p className="text-sm text-gray-500">Manage your connected social accounts</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                </div>
              </Card>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Account Management</h2>
              <Card>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <div>
                      <h3 className="font-medium text-red-600">Deactivate Account</h3>
                      <p className="text-sm text-gray-500">Temporarily disable your account</p>
                    </div>
                    <Button variant="outline" className="text-red-600">
                      Deactivate
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-red-600">Delete Account</h3>
                      <p className="text-sm text-gray-500">Permanently delete your account and data</p>
                    </div>
                    <Button 
                      variant="danger"
                      onClick={handleDeleteAccount}
                      loading={loading}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
            <Card>
              <div className="space-y-6">
                {[
                  { title: 'Booking Updates', description: 'Get notified about your booking status' },
                  { title: 'Messages', description: 'Receive notifications for new messages' },
                  { title: 'Promotions', description: 'Stay updated with deals and offers' },
                  { title: 'Account Security', description: 'Important updates about your account security' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-1 h-4 w-4 text-[#FF5A5F] focus:ring-[#FF5A5F] border-gray-300 rounded"
                    />
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
              <Card>
                <div className="space-y-4">
                  <Button variant="outline" fullWidth icon={<CreditCard size={18} />}>
                    Add Payment Method
                  </Button>
                  
                  <div className="text-center text-gray-500 text-sm">
                    No payment methods added yet
                  </div>
                </div>
              </Card>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Payout Methods</h2>
              <Card>
                <div className="space-y-4">
                  <Button variant="outline" fullWidth>
                    Set Up Payout Method
                  </Button>
                  
                  <div className="text-center text-gray-500 text-sm">
                    Add a payout method to receive your earnings
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">{t('common.comingSoon')}</h2>
            <p className="text-gray-500">{t('common.underDevelopment')}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation */}
          <div className="md:w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
                
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  <span>{t('auth.logout')}</span>
                </button>
              </nav>
            </Card>
          </div>
          
          {/* Content */}
          <div className="flex-grow">
            <Card>
              {renderContent()}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}