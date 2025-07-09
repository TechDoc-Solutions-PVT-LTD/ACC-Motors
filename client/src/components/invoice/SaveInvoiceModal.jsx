import React from 'react';
import { Printer } from 'lucide-react';

export const SaveInvoiceModal = ({
  invoiceNumber,
  setShowSaveModal,
  resetForm,
  generatePDF
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg">
        <h3 className="mb-4 text-lg font-semibold">Invoice Saved Successfully!</h3>
        <p className="mb-6 text-gray-600">
          Invoice {invoiceNumber} has been saved successfully.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setShowSaveModal(false);
              resetForm();
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
          <button
            onClick={() => {
              generatePDF();
              setShowSaveModal(false);
            }}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};