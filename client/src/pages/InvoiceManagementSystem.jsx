import React, { useState } from 'react';
import { Eye, FileText, Package, LogIn, LogOut } from 'lucide-react';
import { CreateInvoice } from '../components/CreateInvoice';
import { InvoiceList } from '../components/InvoiceList';
import { InventoryManagement } from '../components/InventoryManagement';
import { useAuth } from '../context/AuthContext';
import { LoginPopup } from '../components/login/LoginPopup';

export const InvoiceManagementSystem = () => {
  const [activeTab, setActiveTab] = useState('invoice');
  const [showLogin, setShowLogin] = useState(false)
  const { setIsAuthenticated, setIsAdmin, isAdmin } = useAuth()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    setIsAuthenticated(false)
    setIsAdmin(false)
  }

 
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-4 mx-auto max-w-screen-fxl sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between py-4 md:flex-row">
            <div>
              <h1 className="text-2xl font-bold text-center text-gray-900 md:text-left">ACC MOTORS</h1>
              <p className="text-sm text-center text-gray-600 md:text-left">Motorcycle Service Center</p>
            </div>
            <nav className="flex flex-col w-full mt-5 md:space-x-4 xs:flex-row md:mt-0 md:w-auto">
              <button
                onClick={() => setActiveTab('invoice')}
                className={`px-4 py-2 rounded-lg font-medium w-full md:w-auto  ${activeTab === 'invoice'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
                  }`}
              >
                <FileText className="inline w-4 h-4 mr-2" />
                Create Invoice
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`px-4 py-2 rounded-lg font-medium w-full md:w-auto ${activeTab === 'invoices'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
                  }`}
              >
                <Eye className="inline w-4 h-4 mr-2" />
                Invoice List
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 rounded-lg font-medium w-full md:w-auto ${activeTab === 'inventory'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600'
                  }`}
              >
                <Package className="inline w-4 h-4 mr-2" />
                Inventory
              </button>
              {!isAdmin ?
                (
                  <button
                    className={`px-4 py-2 rounded-lg font-medium w-full md:w-auto text-gray-600 hover:text-blue-600`}
                    onClick={() => setShowLogin(true)}
                  >
                    <LogIn className="inline w-4 h-4 mr-2" />
                    Login
                  </button>
                ) : (
                  <button
                    className={`px-4 py-2 rounded-lg font-medium w-full md:w-auto text-gray-600 hover:text-red-600`}
                    onClick={handleLogout}            
                  >
                    <LogOut className="inline w-4 h-4 mr-2" />
                    Logout
                  </button>
                )}
            </nav>
          </div>
        </div>
      </header>

      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
      {/* Main Content */}
      <main className="flex-grow w-full max-w-screen-xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {activeTab === 'invoice' && <CreateInvoice />}
        {activeTab === 'invoices' && <InvoiceList />}
        {activeTab === 'inventory' && <InventoryManagement />}
      </main>

      <footer className="flex items-center justify-center text-sm text-center text-gray-600 bg-white border-t shadow-sm h-14">
        <p>Developed by TechDoc Solutions (Pvt) Ltd</p>
      </footer>
    </div>
  );
};