import React from 'react';
import { CreateInvoice } from '../CreateInvoice';
import { InvoiceList } from '../InvoiceList';
import { InventoryManagement } from '../InventoryManagement';

export const AppMainContent = ({ activeTab }) => {
  return (
    <main className="flex-grow w-full max-w-screen-xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
      {activeTab === 'invoice' && <CreateInvoice />}
      {activeTab === 'invoices' && <InvoiceList />}
      {activeTab === 'inventory' && <InventoryManagement />}
    </main>
  );
};