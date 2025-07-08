import React from 'react';
import { Eye } from 'lucide-react';
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
            <tr key={invoice._id} className={`hover:bg-gray-50 ${ invoice?.status != 'paid' && 'text-red-100'}`}>
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
                {invoice.status === 'paid' ? (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                    Paid
                  </span>
                ) : (
                  // isAdmin && (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        onChange={() => updateInvoiceStatus(invoice._id, 'paid')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      {/* <span className="px-2 py-1 ml-2 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                        Pending
                      </span> */}
                    </label>
                  // )
                )}
              </td>
              <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <button
                    onClick={() => viewInvoiceDetails(invoice._id)}
                    className="text-blue-600 hover:text-blue-900"
                    title="View Invoice"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};