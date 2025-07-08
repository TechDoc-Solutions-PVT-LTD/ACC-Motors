import React from 'react';
import { Eye, Edit } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const InvoiceTable = ({ invoices, viewInvoiceDetails, updateInvoiceStatus, isAdmin }) => {
  return (
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
          {invoices.map((invoice) => (
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
                  {isAdmin && (
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
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};