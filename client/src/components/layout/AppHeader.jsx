import React from 'react';
import { FileText, Eye, Package, LogIn, LogOut } from 'lucide-react';

export const AppHeader = ({ 
  activeTab, 
  setActiveTab, 
  isAdmin, 
  setShowLogin, 
  handleLogout 
}) => {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="px-4 mx-auto max-w-screen-fxl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between py-4 md:flex-row">
          <div>
            <h1 className="text-2xl font-bold text-center text-gray-900 md:text-left">ACC MOTORS</h1>
            <p className="text-sm text-center text-gray-600 md:text-left">Motorcycle Service Center</p>
          </div>
          <nav className="flex flex-col w-full mt-5 md:space-x-4 xs:flex-row md:mt-0 md:w-auto">
            <NavButton
              icon={<FileText className="inline w-4 h-4 mr-2" />}
              label="Create Invoice"
              active={activeTab === 'invoice'}
              onClick={() => setActiveTab('invoice')}
            />
            <NavButton
              icon={<Eye className="inline w-4 h-4 mr-2" />}
              label="Invoice List"
              active={activeTab === 'invoices'}
              onClick={() => setActiveTab('invoices')}
            />
            <NavButton
              icon={<Package className="inline w-4 h-4 mr-2" />}
              label="Inventory"
              active={activeTab === 'inventory'}
              onClick={() => setActiveTab('inventory')}
            />
            {!isAdmin ? (
              <NavButton
                icon={<LogIn className="inline w-4 h-4 mr-2" />}
                label="Login"
                onClick={() => setShowLogin(true)}
                isLogin
              />
            ) : (
              <NavButton
                icon={<LogOut className="inline w-4 h-4 mr-2" />}
                label="Logout"
                onClick={handleLogout}
                isLogout
              />
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

const NavButton = ({ icon, label, active, onClick, isLogin, isLogout }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium w-full md:w-auto";
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses = isLogout 
    ? "text-gray-600 hover:text-red-600" 
    : "text-gray-600 hover:text-blue-600";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    >
      {icon}
      {label}
    </button>
  );
};