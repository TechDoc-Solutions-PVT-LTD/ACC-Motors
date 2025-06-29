import { useEffect } from 'react'
import { Save, Printer } from 'lucide-react'

const sellers = ['John Silva', 'Priya Fernando', 'Kamal Perera']

const availableItems = [
  { id: 1, name: 'Engine Oil', price: 2500 },
  { id: 2, name: 'Brake Pads', price: 3500 },
  { id: 3, name: 'Air Filter', price: 1200 },
  { id: 4, name: 'Spark Plug', price: 800 },
  { id: 5, name: 'Chain & Sprocket Set', price: 4500 },
  { id: 6, name: 'Tire (Front)', price: 6500 },
  { id: 7, name: 'Tire (Rear)', price: 7500 },
  { id: 8, name: 'Battery', price: 5500 }
]

export default function InvoiceForm({ invoiceData, setInvoiceData, onSave, onPrint }) {
  
  // Calculate totals whenever items or labor works change
  useEffect(() => {
    const itemsTotal = invoiceData.items.reduce((sum, item) => sum + item.total, 0)
    const laborTotal = invoiceData.laborWorks.reduce((sum, work) => sum + work.cost, 0)
    const subtotal = itemsTotal + laborTotal
    
    const adjustmentAmount = invoiceData.adjustment.type === '+' 
      ? invoiceData.adjustment.amount 
      : -invoiceData.adjustment.amount
    
    const grandTotal = subtotal + adjustmentAmount
    
    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      grandTotal
    }))
  }, [invoiceData.items, invoiceData.laborWorks, invoiceData.adjustment])

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), itemId: '', name: '', price: 0, quantity: 1, total: 0 }]
    }))
  }

  const updateItem = (id, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          
          if (field === 'itemId') {
            const selectedItem = availableItems.find(ai => ai.id === parseInt(value))
            if (selectedItem) {
              updatedItem.name = selectedItem.name
              updatedItem.price = selectedItem.price
            }
          }
          
          if (field === 'quantity' || field === 'price') {
            updatedItem.total = updatedItem.price * updatedItem.quantity
          }
          
          return updatedItem
        }
        return item
      })
    }))
  }

  const removeItem = (id) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
  }

  const addLaborWork = () => {
    setInvoiceData(prev => ({
      ...prev,
      laborWorks: [...prev.laborWorks, { id: Date.now(), description: '', cost: 0 }]
    }))
  }

  const updateLaborWork = (id, field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      laborWorks: prev.laborWorks.map(work => 
        work.id === id ? { ...work, [field]: field === 'cost' ? parseFloat(value) || 0 : value } : work
      )
    }))
  }

  const removeLaborWork = (id) => {
    setInvoiceData(prev => ({
      ...prev,
      laborWorks: prev.laborWorks.filter(work => work.id !== id)
    }))
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
          <input
            type="text"
            value={invoiceData.invoiceNumber}
            className="w-full p-2 border border-gray-300 rounded bg-gray-50"
            readOnly
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="text"
              value={invoiceData.date}
              className="w-full p-2 border border-gray-300 rounded bg-gray-50"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="text"
              value={invoiceData.time}
              className="w-full p-2 border border-gray-300 rounded bg-gray-50"
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seller</label>
          <select
            value={invoiceData.seller}
            onChange={(e) => setInvoiceData(prev => ({ ...prev, seller: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Seller</option>
            {sellers.map(seller => (
              <option key={seller} value={seller}>{seller}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
          <input
            type="text"
            value={invoiceData.vehicleNumber}
            onChange={(e) => setInvoiceData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter vehicle number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <input
            type="text"
            value={invoiceData.customerName}
            onChange={(e) => setInvoiceData(prev => ({ ...prev, customerName: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter customer name"
          />
        </div>
      </div>

      {/* Items Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Items</h3>
          <button
            onClick={addItem}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add Item
          </button>
        </div>
        
        {invoiceData.items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 p-2 text-left">Item</th>
                  <th className="border border-gray-300 p-2 text-left">Price (LKR)</th>
                  <th className="border border-gray-300 p-2 text-left">Quantity</th>
                  <th className="border border-gray-300 p-2 text-left">Total (LKR)</th>
                  <th className="border border-gray-300 p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map(item => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 p-2">
                      <select
                        value={item.itemId}
                        onChange={(e) => updateItem(item.id, 'itemId', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded"
                      >
                        <option value="">Select Item</option>
                        {availableItems.map(ai => (
                          <option key={ai.id} value={ai.id}>{ai.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full p-1 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full p-1 border border-gray-300 rounded"
                        min="1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 font-semibold">
                      {item.total.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Labor Works Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Labor Works</h3>
          <button
            onClick={addLaborWork}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Add Labor Work
          </button>
        </div>
        
        {invoiceData.laborWorks.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 p-2 text-left">Description</th>
                  <th className="border border-gray-300 p-2 text-left">Cost (LKR)</th>
                  <th className="border border-gray-300 p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.laborWorks.map(work => (
                  <tr key={work.id}>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={work.description}
                        onChange={(e) => updateLaborWork(work.id, 'description', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="Enter work description"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="number"
                        value={work.cost}
                        onChange={(e) => updateLaborWork(work.id, 'cost', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => removeLaborWork(work.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Totals Section */}
      <div className="border-t pt-4">
        <div className="flex justify-end">
          <div className="w-80 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span className="font-semibold">LKR {invoiceData.subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Adjustment:</span>
              <div className="flex items-center space-x-2">
                <select
                  value={invoiceData.adjustment.type}
                  onChange={(e) => setInvoiceData(prev => ({
                    ...prev,
                    adjustment: { ...prev.adjustment, type: e.target.value }
                  }))}
                  className="p-1 border border-gray-300 rounded"
                >
                  <option value="+">+</option>
                  <option value="-">-</option>
                </select>
                <input
                  type="number"
                  value={invoiceData.adjustment.amount}
                  onChange={(e) => setInvoiceData(prev => ({
                    ...prev,
                    adjustment: { ...prev.adjustment, amount: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-24 p-1 border border-gray-300 rounded"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="flex justify-between border-t pt-2">
              <span className="font-bold text-lg">Grand Total:</span>
              <span className="font-bold text-lg">LKR {invoiceData.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6">
        <button
          onClick={onSave}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Invoice
        </button>
        <button
          onClick={onPrint}
          className="flex items-center px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Invoice
        </button>
      </div>

      {/* Footer */}
      <div className="border-t pt-4 text-center text-sm text-gray-600">
        <p>Thank you for choosing ACC Motors!</p>
        <p>For any queries, please contact us at +94 11 234 5678</p>
        <p className="mt-2">Terms & Conditions: Payment due within 30 days</p>
      </div>
    </div>
  )
}