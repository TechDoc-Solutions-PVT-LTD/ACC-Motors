import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config/config';
import { InvoiceTotalsSection } from './invoice/InvoiceTotalsSection';
import { SaveInvoiceModal } from './invoice/SaveInvoiceModal';
import { ServiceDetailsSection } from './invoice/ServiceDetailsSection';
import { CustomerDetailsSection } from './invoice/CustomerDetailsSection';
import { InvoiceHeader } from './invoice/InvoiceHeader';

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
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const resetForm = () => {
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
  };

  // Calculate totals
  const partsTotal = invoiceData.serviceDetails.sparePartsUsed.reduce(
    (sum, part) => sum + (part.quantity * part.unitPrice), 0
  );
  const totalAmount = invoiceData.serviceDetails.serviceCost + partsTotal;
  const netAmount = totalAmount - invoiceData.discount;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <InvoiceHeader
        invoiceNumber={invoiceData.invoiceNumber} 
        companyName="ACC MOTORS"
        companyDescription="Motorcycle Service Center"
        address="No. 123, Main Street, Colombo 01, Sri Lanka"
        contact="Tel: +94 11 234 5678 | Email: info@accmotors.lk"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <CustomerDetailsSection
          invoiceData={invoiceData}
          setInvoiceData={setInvoiceData}
          isCustomerFieldsDisabled={isCustomerFieldsDisabled}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          handleVehicleRegNoChange={handleVehicleRegNoChange}
          selectCustomer={selectCustomer}
        />

        <ServiceDetailsSection
          invoiceData={invoiceData}
          setInvoiceData={setInvoiceData}
          inventoryItems={inventoryItems}
          addSparePart={addSparePart}
          updateSparePart={updateSparePart}
          removeSparePart={removeSparePart}
        />
      </div>

      <InvoiceTotalsSection
        serviceCost={invoiceData.serviceDetails.serviceCost}
        partsTotal={partsTotal}
        totalAmount={totalAmount}
        discount={invoiceData.discount}
        setInvoiceData={setInvoiceData}
        netAmount={netAmount}
        handleSave={handleSave}
      />

      {showSaveModal && (
        <SaveInvoiceModal
          invoiceNumber={invoiceData.invoiceNumber}
          setShowSaveModal={setShowSaveModal}
          resetForm={resetForm}
          generatePDF={() => generatePDF(invoiceData, partsTotal, totalAmount, netAmount)}
        />
      )}
    </div>
  );
};

const generatePDF = (invoiceData, partsTotal, totalAmount, netAmount) => {
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