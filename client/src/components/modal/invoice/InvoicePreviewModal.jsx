import React from 'react';
import { Printer, X } from 'lucide-react';

export const InvoicePreviewModal = ({
  selectedInvoice,
  setShowInvoicePreview,
  formatCurrency,
  formatDate
}) => {
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
  );
};