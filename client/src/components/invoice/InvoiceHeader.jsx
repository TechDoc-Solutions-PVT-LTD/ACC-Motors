import React from 'react';

export const InvoiceHeader = ({ 
  invoiceNumber, 
  companyName, 
  companyDescription, 
  address, 
  contact 
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Invoice</h2>
        <div className="text-right">
          <div className="text-sm text-gray-600">Invoice Number</div>
          <div className="text-lg font-semibold">{invoiceNumber}</div>
        </div>
      </div>

      <div className="p-4 mb-8 text-center border-b">
        <h1 className="text-3xl font-bold text-blue-600">{companyName}</h1>
        <p className="text-lg text-gray-700">{companyDescription}</p>
        <p className="text-sm text-gray-600">{address}</p>
        <p className="text-sm text-gray-600">{contact}</p>
      </div>
    </>
  );
};