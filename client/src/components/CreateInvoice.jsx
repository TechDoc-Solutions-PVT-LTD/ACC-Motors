import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Printer, Save } from 'lucide-react';
import { API_BASE } from '../config/config';

// Utility Functions
const formatCurrency = (amount) => `Rs. ${amount?.toFixed(2) || '0.00'}`;
const formatDate = (date) => new Date(date).toLocaleDateString('en-US');

// Create Invoice Component
export const CreateInvoice = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    customerDetails: {
      vehicleRegNo: '',
      name: '',
      mobile: '',
      address: '',
      vehicleModel: '',
      engineNo: '',
      frameNo: ''
    },
    serviceDetails: {
      km: '',
      serviceCost: 0,
      description: '',
      sparePartsUsed: []
    },
    discount: 0
  });

  const [suggestions, setSuggestions] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isCustomerFieldsDisabled, setIsCustomerFieldsDisabled] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedInvoice, setSavedInvoice] = useState(null);

  // Fetch invoice number on component mount
  useEffect(() => {
    fetchNewInvoiceId();
    fetchInventoryItems();
  }, []);

  const fetchNewInvoiceId = async () => {
    try {
      const response = await fetch(`${API_BASE}/invoice/new-id`);
      const data = await response.json();
      setInvoiceData(prev => ({ ...prev, invoiceNumber: data.invoiceNumber }));
    } catch (error) {
      console.error('Error fetching invoice ID:', error);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const response = await fetch(`${API_BASE}/inventory`);
      const data = await response.json();
      setInventoryItems(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchCustomerSuggestions = async (vehicleRegNo) => {
    if (vehicleRegNo.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/customers?search=${vehicleRegNo}`);
      const data = await response.json();
      setSuggestions(data.filter(customer => 
        customer.vehicleRegNo.toLowerCase().includes(vehicleRegNo.toLowerCase())
      ));
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleVehicleRegNoChange = (value) => {
    setInvoiceData(prev => ({
      ...prev,
      customerDetails: { ...prev.customerDetails, vehicleRegNo: value }
    }));
    
    if (value.trim()) {
      fetchCustomerSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsCustomerFieldsDisabled(false);
    }
  };

  const selectCustomer = (customer) => {
    setInvoiceData(prev => ({
      ...prev,
      customerDetails: {
        vehicleRegNo: customer.vehicleRegNo,
        name: customer.name,
        mobile: customer.mobile,
        address: customer.address,
        vehicleModel: customer.vehicleModel,
        engineNo: customer.engineNo,
        frameNo: customer.frameNo
      }
    }));
    setIsCustomerFieldsDisabled(true);
    setShowSuggestions(false);
  };

  const addSparePart = () => {
    setInvoiceData(prev => ({
      ...prev,
      serviceDetails: {
        ...prev.serviceDetails,
        sparePartsUsed: [
          ...prev.serviceDetails.sparePartsUsed,
          { item: '', quantity: 1, unitPrice: 0 }
        ]
      }
    }));
  };

  const updateSparePart = (index, field, value) => {
    const updatedParts = [...invoiceData.serviceDetails.sparePartsUsed];
    updatedParts[index][field] = value;
    
    // Auto-fill unit price when item is selected
    if (field === 'item') {
      const selectedItem = inventoryItems.find(item => item._id === value);
      if (selectedItem) {
        updatedParts[index].unitPrice = selectedItem.price;
      }
    }
    
    setInvoiceData(prev => ({
      ...prev,
      serviceDetails: {
        ...prev.serviceDetails,
        sparePartsUsed: updatedParts
      }
    }));
  };

  const removeSparePart = (index) => {
    setInvoiceData(prev => ({
      ...prev,
      serviceDetails: {
        ...prev.serviceDetails,
        sparePartsUsed: prev.serviceDetails.sparePartsUsed.filter((_, i) => i !== index)
      }
    }));
  };

  // Calculate totals
  const partsTotal = invoiceData.serviceDetails.sparePartsUsed.reduce(
    (sum, part) => sum + (part.quantity * part.unitPrice), 0
  );
  const totalAmount = invoiceData.serviceDetails.serviceCost + partsTotal;
  const netAmount = totalAmount - invoiceData.discount;

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE}/invoice/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        const savedData = await response.json();
        setSavedInvoice(savedData);
        setShowSaveModal(true);
      } else {
        alert('Error saving invoice');
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice');
    }
  };

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    const billContent = `
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            body { font-family: monospace; font-size: 10px; width: 3in; margin: 0; padding: 10px; }
            .header { text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
            .row { display: flex; justify-content: space-between; margin: 2px 0; }
            .item { margin: 2px 0; }
            .total { border-top: 1px solid #000; padding-top: 5px; margin-top: 10px; }
            .footer { text-align: center; margin-top: 10px; border-top: 1px solid #000; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <strong>ACC MOTORS</strong><br>
            Motorcycle Service Center<br>
            No. 123, Main Street, Colombo 01<br>
            Tel: +94 11 234 5678<br>
            Email: info@accmotors.lk
          </div>
          
          <div class="row">
            <strong>Invoice: ${invoiceData.invoiceNumber}</strong>
          </div>
          <div class="row">
            <span>Date: ${formatDate(new Date())}</span>
          </div>
          
          <div style="margin: 10px 0;">
            <strong>Customer Details:</strong><br>
            Name: ${invoiceData.customerDetails.name}<br>
            Vehicle: ${invoiceData.customerDetails.vehicleRegNo}<br>
            Mobile: ${invoiceData.customerDetails.mobile}
          </div>
          
          <div style="margin: 10px 0;">
            <strong>Service Details:</strong><br>
            KM: ${invoiceData.serviceDetails.km}<br>
            Description: ${invoiceData.serviceDetails.description}
          </div>
          
          <div class="total">
            <div class="row">
              <span>Service Cost:</span>
              <span>${formatCurrency(invoiceData.serviceDetails.serviceCost)}</span>
            </div>
            <div class="row">
              <span>Parts Total:</span>
              <span>${formatCurrency(partsTotal)}</span>
            </div>
            <div class="row">
              <span>Total:</span>
              <span>${formatCurrency(totalAmount)}</span>
            </div>
            <div class="row">
              <span>Discount:</span>
              <span>${formatCurrency(invoiceData.discount)}</span>
            </div>
            <div class="row">
              <strong>Net Amount:</strong>
              <strong>${formatCurrency(netAmount)}</strong>
            </div>
          </div>
          
          <div class="footer">
            Thank you for your business!<br>
            Please visit again
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(billContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Invoice</h2>
        <div className="text-right">
          <div className="text-sm text-gray-600">Invoice Number</div>
          <div className="text-lg font-semibold">{invoiceData.invoiceNumber}</div>
        </div>
      </div>

      {/* Company Header */}
      <div className="p-4 mb-8 text-center border-b">
        <h1 className="text-3xl font-bold text-blue-600">ACC MOTORS</h1>
        <p className="text-lg text-gray-700">Motorcycle Service Center</p>
        <p className="text-sm text-gray-600">No. 123, Main Street, Colombo 01, Sri Lanka</p>
        <p className="text-sm text-gray-600">Tel: +94 11 234 5678 | Email: info@accmotors.lk</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Customer Details */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Customer Details</h3>
          
          <div className="relative mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Vehicle Registration Number
            </label>
            <input
              type="text"
              value={invoiceData.customerDetails.vehicleRegNo}
              onChange={(e) => handleVehicleRegNoChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter vehicle registration number"
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md max-h-48">
                {suggestions.map((customer) => (
                  <div
                    key={customer._id}
                    onClick={() => selectCustomer(customer)}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <div className="font-medium">{customer.vehicleRegNo}</div>
                    <div className="text-sm text-gray-600">{customer.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={invoiceData.customerDetails.name}
                onChange={(e) => setInvoiceData(prev => ({
                  ...prev,
                  customerDetails: { ...prev.customerDetails, name: e.target.value }
                }))}
                disabled={isCustomerFieldsDisabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Mobile</label>
              <input
                type="text"
                value={invoiceData.customerDetails.mobile}
                onChange={(e) => setInvoiceData(prev => ({
                  ...prev,
                  customerDetails: { ...prev.customerDetails, mobile: e.target.value }
                }))}
                disabled={isCustomerFieldsDisabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
              <textarea
                value={invoiceData.customerDetails.address}
                onChange={(e) => setInvoiceData(prev => ({
                  ...prev,
                  customerDetails: { ...prev.customerDetails, address: e.target.value }
                }))}
                disabled={isCustomerFieldsDisabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                rows="3"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Vehicle Model</label>
              <input
                type="text"
                value={invoiceData.customerDetails.vehicleModel}
                onChange={(e) => setInvoiceData(prev => ({
                  ...prev,
                  customerDetails: { ...prev.customerDetails, vehicleModel: e.target.value }
                }))}
                disabled={isCustomerFieldsDisabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Engine No</label>
                <input
                  type="text"
                  value={invoiceData.customerDetails.engineNo}
                  onChange={(e) => setInvoiceData(prev => ({
                    ...prev,
                    customerDetails: { ...prev.customerDetails, engineNo: e.target.value }
                  }))}
                  disabled={isCustomerFieldsDisabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Frame No</label>
                <input
                  type="text"
                  value={invoiceData.customerDetails.frameNo}
                  onChange={(e) => setInvoiceData(prev => ({
                    ...prev,
                    customerDetails: { ...prev.customerDetails, frameNo: e.target.value }
                  }))}
                  disabled={isCustomerFieldsDisabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Service Details */}
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

          {/* Spare Parts */}
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
      </div>

      {/* Totals */}
      <div className="pt-6 mt-8 border-t">
        <div className="flex justify-end">
          <div className="w-96">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Service Cost:</span>
                <span>{formatCurrency(invoiceData.serviceDetails.serviceCost)}</span>
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
                  value={invoiceData.discount}
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
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSave}
          className="flex items-center px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Invoice
        </button>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg">
            <h3 className="mb-4 text-lg font-semibold">Invoice Saved Successfully!</h3>
            <p className="mb-6 text-gray-600">
              Invoice {invoiceData.invoiceNumber} has been saved successfully.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  // Reset form
                  setInvoiceData({
                    invoiceNumber: '',
                    customerDetails: {
                      vehicleRegNo: '',
                      name: '',
                      mobile: '',
                      address: '',
                      vehicleModel: '',
                      engineNo: '',
                      frameNo: ''
                    },
                    serviceDetails: {
                      km: '',
                      serviceCost: 0,
                      description: '',
                      sparePartsUsed: []
                    },
                    discount: 0
                  });
                  setIsCustomerFieldsDisabled(false);
                  fetchNewInvoiceId();
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
      )}
    </div>
  );
};