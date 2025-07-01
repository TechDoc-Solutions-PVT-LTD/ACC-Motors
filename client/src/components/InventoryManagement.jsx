import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Package, Save } from 'lucide-react';

// API Base URL
const API_BASE = 'http://localhost:3001/api';

// Utility Functions
const formatCurrency = (amount) => `Rs. ${amount?.toFixed(2) || '0.00'}`;

// Inventory Management Component
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
  
    // Form states
    const [newItem, setNewItem] = useState({
      name: '',
      sku: '',
      price: 0,
      quantity: 0,
      category: 'spare-part'
    });
  
    // Fetch inventory items
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
        } else {
          alert('Error adding item');
        }
      } catch (error) {
        console.error('Error adding item:', error);
        alert('Error adding item');
      }
    };
  
    const handleUpdateItem = async () => {
      try {
        const newItem = {};
        newItem.name = currentItem.name, 
        newItem.price = currentItem.price, 
        newItem.quantity = currentItem.quantity, 
        newItem.category = currentItem.category
        const response = await fetch(`${API_BASE}/inventory/${currentItem._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });
  
        if (response.ok) {
          setShowEditModal(false);
          setCurrentItem(null);
          fetchInventoryItems();
        } else {
          alert('Error updating item');
        }
      } catch (error) {
        console.error('Error updating item:', error);
        alert('Error updating item');
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
        } else {
          alert('Error restocking item');
        }
      } catch (error) {
        console.error('Error restocking item:', error);
        alert('Error restocking item');
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
          } else {
            alert('Error deleting item');
          }
        } catch (error) {
          console.error('Error deleting item:', error);
          alert('Error deleting item');
        }
      }
    };
  
    // Apply filters
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
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </button>
          </div>
        </div>
  
        {/* Inventory Table */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No inventory items found
                    </td>
                  </tr>
                ) : (
                  inventoryItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {item.category === 'spare-part' ? 'Spare Part' : 'Consumable'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.quantity > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setCurrentItem(item);
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setCurrentItem({ ...item, restockQuantity: 0 });
                              setShowRestockModal(true);
                            }}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
  
        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg">
              <h3 className="mb-4 text-lg font-semibold">Add New Inventory Item</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">SKU</label>
                  <input
                    type="text"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="spare-part">Spare Part</option>
                    <option value="consumable">Consumable</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Item
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Edit Item Modal */}
        {showEditModal && currentItem && (
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
        )}
  
        {/* Restock Modal */}
        {showRestockModal && currentItem && (
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
        )}
      </div>
    );
  };