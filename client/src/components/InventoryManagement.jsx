import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { API_BASE } from '../config/config';
import { useAuth } from '../context/AuthContext';
import { InventoryTable } from './tables/InventoryTable';
import { AddItemModal } from './modal/inventory/AddItemModal';
import { EditItemModal } from './modal/inventory/EditItemModal';
import { RestockModal } from './modal/inventory/RestockModal';

export const InventoryManagement = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [inStockFilter, setInStockFilter] = useState(false);
  const { isAdmin } = useAuth();

  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    price: 0,
    quantity: 0,
    category: 'spare-part'
  });

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE}/inventory`;
      const params = new URLSearchParams();

      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);
      if (inStockFilter) params.append('inStock', 'true');

      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();
      setInventoryItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      const response = await fetch(`${API_BASE}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewItem({
          name: '',
          sku: '',
          price: 0,
          quantity: 0,
          category: 'spare-part'
        });
        fetchInventoryItems();
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleUpdateItem = async () => {
    try {
      const updatedItem = {
        name: currentItem.name,
        price: currentItem.price,
        quantity: currentItem.quantity,
        category: currentItem.category
      };
      
      const response = await fetch(`${API_BASE}/inventory/${currentItem._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        setShowEditModal(false);
        setCurrentItem(null);
        fetchInventoryItems();
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleRestockItem = async () => {
    try {
      const response = await fetch(`${API_BASE}/inventory/${currentItem._id}/restock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: currentItem.restockQuantity }),
      });

      if (response.ok) {
        setShowRestockModal(false);
        setCurrentItem(null);
        fetchInventoryItems();
      }
    } catch (error) {
      console.error('Error restocking item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`${API_BASE}/inventory/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchInventoryItems();
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchInventoryItems();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, categoryFilter, inStockFilter]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>

        <div className="flex flex-col w-full gap-4 sm:flex-row sm:w-auto">
          <div className="relative">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="spare-part">Spare Parts</option>
            <option value="consumable">Consumables</option>
          </select>

          <label className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={inStockFilter}
              onChange={(e) => setInStockFilter(e.target.checked)}
              className="mr-2 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm">In Stock Only</span>
          </label>

          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </button>
          )}
        </div>
      </div>

      <InventoryTable
        loading={loading}
        inventoryItems={inventoryItems}
        isAdmin={isAdmin}
        setCurrentItem={setCurrentItem}
        setShowEditModal={setShowEditModal}
        setShowRestockModal={setShowRestockModal}
        handleDeleteItem={handleDeleteItem}
      />

      {showAddModal && (
        <AddItemModal
          newItem={newItem}
          setNewItem={setNewItem}
          setShowAddModal={setShowAddModal}
          handleAddItem={handleAddItem}
        />
      )}

      {showEditModal && currentItem && (
        <EditItemModal
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          setShowEditModal={setShowEditModal}
          handleUpdateItem={handleUpdateItem}
        />
      )}

      {showRestockModal && currentItem && (
        <RestockModal
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          setShowRestockModal={setShowRestockModal}
          handleRestockItem={handleRestockItem}
        />
      )}
    </div>
  );
};