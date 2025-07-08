import React from 'react';
import { Save } from 'lucide-react';

export const EditItemModal = ({ currentItem, setCurrentItem, setShowEditModal, handleUpdateItem }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg">
        <h3 className="mb-4 text-lg font-semibold">Edit Inventory Item</h3>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={currentItem.name}
              onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              value={currentItem.sku}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={currentItem.price}
                onChange={(e) => setCurrentItem({ ...currentItem, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
            <select
              value={currentItem.category}
              onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="spare-part">Spare Part</option>
              <option value="consumable">Consumable</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={() => setShowEditModal(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateItem}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Update Item
          </button>
        </div>
      </div>
    </div>
  );
};