import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { API_BASE } from '../config/config';
import { useAuth } from '../context/AuthContext';
import { InvoiceTable } from './tables/ InvoiceTable';
import { InvoicePagination } from './invoice/InvoicePagination';
import { InvoicePreviewModal } from './modal/invoice/InvoicePreviewModal';

export const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const { isAdmin } = useAuth();
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
        fetchInvoices();
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
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

      <InvoiceTable
        invoices={paginatedInvoices} 
        viewInvoiceDetails={viewInvoiceDetails} 
        updateInvoiceStatus={updateInvoiceStatus} 
        isAdmin={isAdmin}
      />

      <InvoicePagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        filteredInvoices={filteredInvoices}
        setCurrentPage={setCurrentPage}
      />

      {showInvoicePreview && selectedInvoice && (
        <InvoicePreviewModal
          selectedInvoice={selectedInvoice}
          setShowInvoicePreview={setShowInvoicePreview}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};