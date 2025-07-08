import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const InvoicePagination = ({
  currentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  filteredInvoices,
  setCurrentPage
}) => {
  return (
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
  );
};