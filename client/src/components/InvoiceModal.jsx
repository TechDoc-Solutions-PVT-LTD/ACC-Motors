import { X, Printer } from 'lucide-react'
import { generateInvoicePDF } from '../utils/pdfGenerator'

export default function InvoiceModal({ invoice, onClose }) {
  const handlePrint = () => {
    generateInvoicePDF(invoice)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">Invoice Details</h2>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              <Printer className="w-4 h-4 mr-1" />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-3xl font-bold text-black">ACC MOTORS</h1>
            <p className="text-lg text-gray-800">Motorcycle Service Center</p>
            <div className="mt-2 text-sm text-gray-700">
              <p>No. 123, Main Street, Colombo 01, Sri Lanka</p>
              <p>Tel: +94 11 234 5678 | Email: info@accmotors.lk</p>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-black">SERVICE INVOICE</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="font-medium">Invoice Number: <span className="font-normal">{invoice.invoiceNumber}</span></p>
              <p className="font-medium">Date: <span className="font-normal">{invoice.date}</span></p>
              <p className="font-medium">Time: <span className="font-normal">{invoice.time}</span></p>
            </div>
            <div>
              <p className="font-medium">Seller: <span className="font-normal">{invoice.seller}</span></p>
              <p className="font-medium">Vehicle Number: <span className="font-normal">{invoice.vehicleNumber}</span></p>
              <p className="font-medium">Customer: <span className="font-normal">{invoice.customerName}</span></p>
            </div>
          </div>

          {/* Items Table */}
          {invoice.items.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Items</h3>
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">Item</th>
                    <th className="border border-gray-300 p-2 text-left">Price (LKR)</th>
                    <th className="border border-gray-300 p-2 text-left">Qty</th>
                    <th className="border border-gray-300 p-2 text-left">Total (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">{item.name}</td>
                      <td className="border border-gray-300 p-2">{item.price.toFixed(2)}</td>
                      <td className="border border-gray-300 p-2">{item.quantity}</td>
                      <td className="border border-gray-300 p-2">{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Labor Works Table */}
          {invoice.laborWorks.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Labor Works</h3>
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">Description</th>
                    <th className="border border-gray-300 p-2 text-left">Cost (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.laborWorks.map((work, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">{work.description}</td>
                      <td className="border border-gray-300 p-2">{work.cost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span className="font-semibold">LKR {invoice.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Adjustment ({invoice.adjustment.type}):</span>
                <span className="font-semibold">LKR {invoice.adjustment.amount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold text-lg">Grand Total:</span>
                <span className="font-bold text-lg">LKR {invoice.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-4 border-t text-center text-sm text-gray-600">
            <p>Thank you for choosing ACC Motors!</p>
            <p>For any queries, please contact us at +94 11 234 5678</p>
            <p className="mt-2">Terms & Conditions: Payment due within 30 days</p>
          </div>
        </div>
      </div>
    </div>
  )
}