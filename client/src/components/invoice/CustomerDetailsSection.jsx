import React from 'react';

export const CustomerDetailsSection = ({
  invoiceData,
  setInvoiceData,
  isCustomerFieldsDisabled,
  suggestions,
  showSuggestions,
  handleVehicleRegNoChange,
  selectCustomer
}) => {
  return (
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
  );
};