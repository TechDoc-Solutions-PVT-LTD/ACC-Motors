import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Swal from 'sweetalert2'
import InvoiceHeader from '../components/InvoiceHeader'
import InvoiceForm from '../components/InvoiceForm'
import { generateInvoicePDF } from '../utils/pdfGenerator'
import { saveInvoice } from '../utils/invoiceStorage'

export default function InvoicePage() {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    date: '',
    time: '',
    seller: '',
    vehicleNumber: '',
    customerName: '',
    items: [],
    laborWorks: [],
    subtotal: 0,
    adjustment: { type: '+', amount: 0 },
    grandTotal: 0
  })

  useEffect(() => {
    const now = new Date()
    const invoiceNumber = `INV-${format(now, 'yyyyMMdd-HHmmss')}`
    const date = format(now, 'yyyy-MM-dd')
    const time = format(now, 'HH:mm:ss')

    setInvoiceData(prev => ({
      ...prev,
      invoiceNumber,
      date,
      time
    }))
  }, [])

  const handleSave = async () => {
    if (!invoiceData.seller || !invoiceData.vehicleNumber || !invoiceData.customerName) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all required fields'
      })
      return
    }

    try {
      await saveInvoice(invoiceData)
      Swal.fire({
        icon: 'success',
        title: 'Invoice Saved',
        text: 'Invoice has been saved successfully'
      })

      const now = new Date()
      const invoiceNumber = `INV-${format(now, 'yyyyMMdd-HHmmss')}`
      const date = format(now, 'yyyy-MM-dd')
      const time = format(now, 'HH:mm:ss')

      setInvoiceData({
        invoiceNumber,
        date,
        time,
        seller: '',
        vehicleNumber: '',
        customerName: '',
        items: [],
        laborWorks: [],
        subtotal: 0,
        adjustment: { type: '+', amount: 0 },
        grandTotal: 0
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save invoice'
      })
      console.error('Failed', error)
    }
  }

  const handlePrint = () => {
    generateInvoicePDF(invoiceData)
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg">
      <InvoiceHeader />
      <InvoiceForm 
        invoiceData={invoiceData}
        setInvoiceData={setInvoiceData}
        onSave={handleSave}
        onPrint={handlePrint}
      />
    </div>
  )
}
