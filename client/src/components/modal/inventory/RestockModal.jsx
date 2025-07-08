import React from 'react';
import { Package } from 'lucide-react';

export const RestockModal = ({ currentItem, setCurrentItem, setShowRestockModal, handleRestockItem }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg">
        <h3 className="mb-4 text-lg font-semibold">Restock {currentItem.name}</h3>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Current Quantity</label>
            <input
              type="number"
              value={currentItem.quantity}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Quantity to Add</label>
            <input
              type="number"
              value={currentItem.restockQuantity || 0}
              onChange={(e) => setCurrentItem({
                ...currentItem,
                restockQuantity: parseInt(e.target.value) || 0
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={() => setShowRestockModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleRestockItem}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Package className="w-4 h-4 mr-2" />
            Restock
          </button>
        </div>
      </div>
    </div>
  );
};