import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginPopup } from '../components/login/LoginPopup';
import { AppHeader } from '../components/layout/AppHeader';
import { AppMainContent } from '../components/layout/AppMainContent';
import { AppFooter } from '../components/layout/AppFooter';

export const InvoiceManagementSystem = () => {
  const [activeTab, setActiveTab] = useState('invoice');
  const [showLogin, setShowLogin] = useState(false);
  const { setIsAuthenticated, setIsAdmin, isAdmin } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <AppHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdmin={isAdmin}
        setShowLogin={setShowLogin}
        handleLogout={handleLogout}
      />
      
      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
      
      <AppMainContent activeTab={activeTab} />
      
      <AppFooter />
    </div>
  );
};