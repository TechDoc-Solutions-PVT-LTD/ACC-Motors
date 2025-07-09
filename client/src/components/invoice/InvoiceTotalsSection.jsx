import React from 'react';
import { Save } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const InvoiceTotalsSection = ({
  serviceCost,
  partsTotal,
  totalAmount,
  discount,
  setInvoiceData,
  netAmount,
  handleSave
}) => {
  return (
    <div className="pt-6 mt-8 border-t">
      <div className="flex justify-end">
        <div className="w-96">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Service Cost:</span>
              <span>{formatCurrency(serviceCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Parts Total:</span>
              <span>{formatCurrency(partsTotal)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount:</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount:</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setInvoiceData(prev => ({
                  ...prev,
                  discount: parseFloat(e.target.value) || 0
                }))}
                className="w-24 px-3 py-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between pt-2 text-xl font-bold border-t">
              <span>Net Amount:</span>
              <span>{formatCurrency(netAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className="flex items-center px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Invoice
        </button>
      </div>
    </div>
  );
};