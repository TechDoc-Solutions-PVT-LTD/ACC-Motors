import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export const ServiceDetailsSection = ({
  invoiceData,
  setInvoiceData,
  inventoryItems,
  addSparePart,
  updateSparePart,
  removeSparePart
}) => {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Service Details</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">KM Reading</label>
          <input
            type="number"
            value={invoiceData.serviceDetails.km}
            onChange={(e) => setInvoiceData(prev => ({
              ...prev,
              serviceDetails: { ...prev.serviceDetails, km: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Service Cost</label>
          <input
            type="number"
            value={invoiceData.serviceDetails.serviceCost}
            onChange={(e) => setInvoiceData(prev => ({
              ...prev,
              serviceDetails: { ...prev.serviceDetails, serviceCost: parseFloat(e.target.value) || 0 }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={invoiceData.serviceDetails.description}
            onChange={(e) => setInvoiceData(prev => ({
              ...prev,
              serviceDetails: { ...prev.serviceDetails, description: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Spare Parts Used</h4>
          <button
            onClick={addSparePart}
            className="flex items-center px-3 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Part
          </button>
        </div>

        {invoiceData.serviceDetails.sparePartsUsed.map((part, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select
              value={part.item}
              onChange={(e) => updateSparePart(index, 'item', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Item</option>
              {inventoryItems.map(item => (
                <option key={item._id} value={item._id}>
                  {item.name} - {item.sku}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={part.quantity}
              onChange={(e) => updateSparePart(index, 'quantity', parseInt(e.target.value) || 0)}
              placeholder="Qty"
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={part.unitPrice}
              onChange={(e) => updateSparePart(index, 'unitPrice', parseFloat(e.target.value) || 0)}
              placeholder="Price"
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => removeSparePart(index)}
              className="px-2 text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};