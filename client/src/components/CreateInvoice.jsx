import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config/config';
import { InvoiceTotalsSection } from './invoice/InvoiceTotalsSection';
import { SaveInvoiceModal } from './invoice/SaveInvoiceModal';
import { ServiceDetailsSection } from './invoice/ServiceDetailsSection';
import { CustomerDetailsSection } from './invoice/CustomerDetailsSection';
import { InvoiceHeader } from './invoice/InvoiceHeader';
import { InvoicePDFGenerator } from '../utils/InvoicePDFGenerator';

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

  const { generatePDF } = InvoicePDFGenerator({ invoice: invoiceData });

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
          generatePDF={generatePDF}
        />
      )}
    </div>
  );
};