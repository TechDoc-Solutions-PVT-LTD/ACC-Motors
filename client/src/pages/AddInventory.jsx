import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { format } from 'date-fns'
import { Save, ArrowLeft } from 'lucide-react'
import Swal from 'sweetalert2'
import { saveInventoryItem, getInventoryItems } from '../utils/inventoryStorage'

export default function AddInventory() {
  const navigate = useNavigate()
  const location = useLocation()
  const editItem = location.state?.editItem

  const [formData, setFormData] = useState({
    id: '',
    itemId: '',
    itemName: '',
    supplierName: '',
    quantity: 0,
    unitPrice: 0,
    dateReceived: '',
    timeReceived: '',
    description: ''
  })

  const [existingItems, setExistingItems] = useState([])
  const [isExistingItem, setIsExistingItem] = useState(false)

  useEffect(() => {
    loadExistingItems()
    
    if (editItem) {
      // Editing existing item
      setFormData(editItem)
    } else {
      // Adding new item
      const now = new Date()
      const itemId = `ITM-${format(now, 'yyyyMMdd-HHmmss')}`
      const dateReceived = format(now, 'yyyy-MM-dd')
      const timeReceived = format(now, 'HH:mm:ss')
      
      setFormData(prev => ({
        ...prev,
        itemId,
        dateReceived,
        timeReceived
      }))
    }
  }, [editItem])

  const loadExistingItems = async () => {
    try {
      const items = await getInventoryItems()
      setExistingItems(items)
    } catch (error) {
      console.error('Failed to load existing items:', error)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'quantity' || field === 'unitPrice' ? parseFloat(value) || 0 : value
    }))
  }

  const handleItemNameSelect = (selectedItemName) => {
    const existingItem = existingItems.find(item => item.itemName === selectedItemName)
    
    if (existingItem) {
      setIsExistingItem(true)
      setFormData(prev => ({
        ...prev,
        itemName: existingItem.itemName,
        supplierName: existingItem.supplierName,
        unitPrice: existingItem.unitPrice,
        description: existingItem.description
      }))
    } else {
      setIsExistingItem(false)
      handleInputChange('itemName', selectedItemName)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.itemName || !formData.supplierName || formData.quantity <= 0 || formData.unitPrice <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all required fields with valid values'
      })
      return
    }

    try {
      if (isExistingItem && !editItem) {
        // Update quantity for existing item
        const existingItem = existingItems.find(item => item.itemName === formData.itemName)
        const updatedItem = {
          ...existingItem,
          quantity: existingItem.quantity + formData.quantity,
          dateReceived: formData.dateReceived,
          timeReceived: formData.timeReceived
        }
        await saveInventoryItem(updatedItem)
        
        Swal.fire({
          icon: 'success',
          title: 'Quantity Updated',
          text: `Added ${formData.quantity} units to existing item`
        })
      } else {
        // Save new item or update existing item
        await saveInventoryItem(formData)
        
        Swal.fire({
          icon: 'success',
          title: editItem ? 'Item Updated' : 'Item Added',
          text: `Inventory item has been ${editItem ? 'updated' : 'added'} successfully`
        })
      }

      navigate('/inventory')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to ${editItem ? 'update' : 'save'} inventory item`
      })
      console.error('Failed', error)
    }
  }

  const uniqueItemNames = [...new Set(existingItems.map(item => item.itemName))]

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {editItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
        </h1>
        <button
          onClick={() => navigate('/inventory')}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inventory
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item ID</label>
            <input
              type="text"
              value={formData.itemId}
              className="w-full p-2 border border-gray-300 rounded bg-gray-50"
              readOnly
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="text"
                value={formData.dateReceived}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="text"
                value={formData.timeReceived}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name <span className="text-red-500">*</span>
          </label>
          {!editItem ? (
            <div className="relative">
              <input
                type="text"
                list="item-names"
                value={formData.itemName}
                onChange={(e) => handleItemNameSelect(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter item name or select from existing"
                required
              />
              <datalist id="item-names">
                {uniqueItemNames.map(name => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
          ) : (
            <input
              type="text"
              value={formData.itemName}
              onChange={(e) => handleInputChange('itemName', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter item name"
              required
            />
          )}
          {isExistingItem && !editItem && (
            <p className="text-sm text-blue-600 mt-1">
              ✓ Existing item selected. Quantity will be added to current stock.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.supplierName}
            onChange={(e) => handleInputChange('supplierName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter supplier name"
            required
            disabled={isExistingItem && !editItem}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
              min="1"
              required
            />
            {isExistingItem && !editItem && (
              <p className="text-sm text-gray-600 mt-1">
                This will be added to existing quantity
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Price (LKR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.unitPrice}
              onChange={(e) => handleInputChange('unitPrice', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Enter unit price"
              min="0"
              step="0.01"
              required
              disabled={isExistingItem && !editItem}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter item description (optional)"
            rows="3"
            disabled={isExistingItem && !editItem}
          />
        </div>

        {/* Total Value Display */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Value:</span>
            <span className="font-bold text-lg text-gray-900">
              LKR {(formData.quantity * formData.unitPrice).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {editItem ? 'Update Item' : 'Save Item'}
          </button>
        </div>
      </form>
    </div>
  )
}