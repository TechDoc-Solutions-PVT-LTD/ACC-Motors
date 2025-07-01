import React, { useState, useEffect } from 'react';
import { Search, Edit, Eye, Printer, ChevronLeft, ChevronRight, X } from 'lucide-react';

// API Base URL
const API_BASE = 'http://localhost:3001/api';

// Utility Functions
const formatCurrency = (amount) => `Rs. ${amount?.toFixed(2) || '0.00'}`;
const formatDate = (date) => new Date(date).toLocaleDateString('en-US');

// Invoice List Component
export const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showInvoicePreview, setShowInvoicePreview] = useState(false);
    const itemsPerPage = 10;
  
    useEffect(() => {
      fetchInvoices();
    }, []);
  
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`${API_BASE}/invoice`);
        const data = await response.json();
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };
  
    const filteredInvoices = invoices.filter(invoice => {
      const matchesSearch = 
        invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer?.vehicleRegNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);
  
    const viewInvoiceDetails = async (invoiceId) => {
      try {
        const response = await fetch(`${API_BASE}/invoice/${invoiceId}`);
        const data = await response.json();
        setSelectedInvoice(data);
        setShowInvoicePreview(true);
      } catch (error) {
        console.error('Error fetching invoice details:', error);
      }
    };
  
    const updateInvoiceStatus = async (invoiceId, newStatus) => {
      try {
        const response = await fetch(`${API_BASE}/invoice/${invoiceId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });
  
        if (response.ok) {
          fetchInvoices(); // Refresh the list
        }
      } catch (error) {
        console.error('Error updating invoice status:', error);
      }
    };
  
    const generateInvoicePDF = (invoice) => {
      const printWindow = window.open('', '_blank');
      const billContent = `
        <html>
          <head>
            <title>Invoice ${invoice.invoiceNumber}</title>
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
              <strong>Invoice: ${invoice.invoiceNumber}</strong>
            </div>
            <div class="row">
              <span>Date: ${formatDate(invoice.issuedAt)}</span>
            </div>
            
            <div style="margin: 10px 0;">
              <strong>Customer Details:</strong><br>
              Name: ${invoice.customer?.name || 'N/A'}<br>
              Vehicle: ${invoice.customer?.vehicleRegNo || 'N/A'}<br>
              Mobile: ${invoice.customer?.mobile || 'N/A'}
            </div>
            
            <div style="margin: 10px 0;">
              <strong>Service Details:</strong><br>
              KM: ${invoice.service?.km || 'N/A'}<br>
              Description: ${invoice.service?.description || 'N/A'}
            </div>
            
            ${invoice.service?.sparePartsUsed?.length > 0 ? `
            <div style="margin: 10px 0;">
              <strong>Parts Used:</strong><br>
              ${invoice.service.sparePartsUsed.map(part => `
                ${part.item?.name || 'N/A'} - 
                ${part.quantity} x ${formatCurrency(part.unitPrice)} = 
                ${formatCurrency(part.quantity * part.unitPrice)}<br>
              `).join('')}
            </div>
            ` : ''}
            
            <div class="total">
              <div class="row">
                <span>Service Cost:</span>
                <span>${formatCurrency(invoice.service?.serviceCost || 0)}</span>
              </div>
              <div class="row">
                <span>Parts Total:</span>
                <span>${formatCurrency(invoice.service?.sparePartsUsed?.reduce((sum, part) => sum + (part.quantity * part.unitPrice), 0) || 0)}</span>
              </div>
              <div class="row">
                <span>Total:</span>
                <span>${formatCurrency(invoice.totalAmount || 0)}</span>
              </div>
              <div class="row">
                <span>Discount:</span>
                <span>${formatCurrency(invoice.discount || 0)}</span>
              </div>
              <div class="row">
                <strong>Net Amount:</strong>
                <strong>${formatCurrency(invoice.netAmount || 0)}</strong>
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
        <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-bold text-gray-900">Invoice List</h2>
          
          <div className="flex flex-col w-full gap-4 sm:flex-row sm:w-auto">
            <div className="relative">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search by invoice no, vehicle no, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
  
        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Invoice No
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Amount
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
              {paginatedInvoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(invoice.issuedAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {invoice.customer?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {invoice.customer?.vehicleRegNo || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {formatCurrency(invoice.netAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewInvoiceDetails(invoice._id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateInvoiceStatus(
                          invoice._id, 
                          invoice.status === 'pending' ? 'paid' : 'pending'
                        )}
                        className="text-green-600 hover:text-green-900"
                        title={invoice.status === 'pending' ? 'Mark as Paid' : 'Mark as Pending'}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 border rounded-md ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
  
        {/* Invoice Preview Modal */}
        {showInvoicePreview && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl p-6 mx-4 bg-white rounded-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Invoice Preview - {selectedInvoice.invoiceNumber}</h3>
                <button
                  onClick={() => setShowInvoicePreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
  
              {/* Company Header */}
              <div className="p-4 mb-8 text-center border-b">
                <h1 className="text-3xl font-bold text-blue-600">ACC MOTORS</h1>
                <p className="text-lg text-gray-700">Motorcycle Service Center</p>
                <p className="text-sm text-gray-600">No. 123, Main Street, Colombo 01, Sri Lanka</p>
                <p className="text-sm text-gray-600">Tel: +94 11 234 5678 | Email: info@accmotors.lk</p>
              </div>
  
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Invoice Info */}
                <div>
                  <h4 className="mb-2 font-semibold">Invoice Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Invoice No:</span> {selectedInvoice.invoiceNumber}</p>
                    <p><span className="font-medium">Date:</span> {formatDate(selectedInvoice.issuedAt)}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        selectedInvoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedInvoice.status}
                      </span>
                    </p>
                  </div>
                </div>
  
                {/* Customer Info */}
                <div>
                  <h4 className="mb-2 font-semibold">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedInvoice.customer?.name || 'N/A'}</p>
                    <p><span className="font-medium">Mobile:</span> {selectedInvoice.customer?.mobile || 'N/A'}</p>
                    <p><span className="font-medium">Vehicle:</span> {selectedInvoice.customer?.vehicleRegNo || 'N/A'}</p>
                    <p><span className="font-medium">Model:</span> {selectedInvoice.customer?.vehicleModel || 'N/A'}</p>
                  </div>
                </div>
              </div>
  
              {/* Service Details */}
              <div className="mt-6">
                <h4 className="mb-2 font-semibold">Service Details</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">KM:</span> {selectedInvoice.service?.km || 'N/A'}</p>
                  <p><span className="font-medium">Description:</span> {selectedInvoice.service?.description || 'N/A'}</p>
                  <p><span className="font-medium">Service Cost:</span> {formatCurrency(selectedInvoice.service?.serviceCost || 0)}</p>
                </div>
              </div>
  
              {/* Spare Parts */}
              {selectedInvoice.service?.sparePartsUsed?.length > 0 && (
                <div className="mt-6">
                  <h4 className="mb-2 font-semibold">Spare Parts Used</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">Item</th>
                          <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">Qty</th>
                          <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">Unit Price</th>
                          <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedInvoice.service.sparePartsUsed.map((part, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm">{part.item?.name || 'N/A'}</td>
                            <td className="px-4 py-2 text-sm">{part.quantity}</td>
                            <td className="px-4 py-2 text-sm">{formatCurrency(part.unitPrice)}</td>
                            <td className="px-4 py-2 text-sm">{formatCurrency(part.quantity * part.unitPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
  
              {/* Totals */}
              <div className="pt-4 mt-6 border-t">
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Service Cost:</span>
                        <span>{formatCurrency(selectedInvoice.service?.serviceCost || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Parts Total:</span>
                        <span>{formatCurrency(selectedInvoice.service?.sparePartsUsed?.reduce((sum, part) => sum + (part.quantity * part.unitPrice), 0) || 0)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount:</span>
                        <span>{formatCurrency(selectedInvoice.totalAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span>{formatCurrency(selectedInvoice.discount || 0)}</span>
                      </div>
                      <div className="flex justify-between pt-2 text-lg font-bold border-t">
                        <span>Net Amount:</span>
                        <span>{formatCurrency(selectedInvoice.netAmount || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={() => setShowInvoicePreview(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => generateInvoicePDF(selectedInvoice)}
                  className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};
