import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Generate PDF for a single invoice
export const generateInvoicePDF = (invoice) => {
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.setTextColor(0, 0, 0)
  doc.text('ACC MOTORS', 105, 15, { align: 'center' })
  doc.setFontSize(14)
  doc.text('Motorcycle Service Center', 105, 22, { align: 'center' })
  doc.setFontSize(10)
  doc.text('No. 123, Main Street, Colombo 01, Sri Lanka', 105, 28, { align: 'center' })
  doc.text('Tel: +94 11 234 5678 | Email: info@accmotors.lk', 105, 32, { align: 'center' })

  doc.setFontSize(16)
  doc.text('SERVICE INVOICE', 105, 42, { align: 'center' })

  doc.setFontSize(10)
  doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 15, 50)
  doc.text(`Date: ${invoice.date}`, 15, 55)
  doc.text(`Time: ${invoice.time}`, 15, 60)
  doc.text(`Seller: ${invoice.seller}`, 105, 50)
  doc.text(`Vehicle Number: ${invoice.vehicleNumber}`, 105, 55)
  doc.text(`Customer: ${invoice.customerName}`, 105, 60)

  let currentY = 70

  if (invoice.items.length > 0) {
    const itemsData = invoice.items.map(item => [
      item.name,
      item.price.toFixed(2),
      item.quantity,
      item.total.toFixed(2)
    ])

    autoTable(doc, {
      startY: currentY,
      head: [['Item', 'Price (LKR)', 'Qty', 'Total (LKR)']],
      body: itemsData,
      theme: 'grid',
      headStyles: { fillColor: [220, 220, 220] }
    })

    currentY = doc.lastAutoTable.finalY + 10
  }

  if (invoice.laborWorks.length > 0) {
    const laborData = invoice.laborWorks.map(work => [
      work.description,
      work.cost.toFixed(2)
    ])

    autoTable(doc, {
      startY: currentY,
      head: [['Labor Work', 'Cost (LKR)']],
      body: laborData,
      theme: 'grid',
      headStyles: { fillColor: [220, 220, 220] }
    })

    currentY = doc.lastAutoTable.finalY + 10
  }

  doc.setFontSize(10)
  doc.text(`Subtotal: LKR ${invoice.subtotal.toFixed(2)}`, 150, currentY)
  doc.text(`Adjustment (${invoice.adjustment.type}): LKR ${invoice.adjustment.amount.toFixed(2)}`, 150, currentY + 5)
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text(`Grand Total: LKR ${invoice.grandTotal.toFixed(2)}`, 150, currentY + 12)

  doc.setFont(undefined, 'normal')
  doc.setFontSize(10)
  doc.text('Thank you for choosing ACC Motors!', 105, currentY + 25, { align: 'center' })
  doc.text('For any queries, please contact us at +94 11 234 5678', 105, currentY + 30, { align: 'center' })
  doc.text('Terms & Conditions: Payment due within 30 days', 105, currentY + 35, { align: 'center' })

  doc.save(`invoice_${invoice.invoiceNumber}.pdf`)
}

// Generate PDF for invoice list
export const generateInvoiceListPDF = (invoices) => {
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.setTextColor(0, 0, 0)
  doc.text('ACC MOTORS', 105, 15, { align: 'center' })
  doc.setFontSize(14)
  doc.text('Invoice List Report', 105, 22, { align: 'center' })
  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' })

  const tableData = invoices.map(invoice => [
    invoice.invoiceNumber,
    invoice.date,
    invoice.vehicleNumber,
    invoice.customerName,
    invoice.seller,
    invoice.grandTotal.toFixed(2)
  ])

  autoTable(doc, {
    startY: 35,
    head: [['Invoice #', 'Date', 'Vehicle', 'Customer', 'Seller', 'Total (LKR)']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [220, 220, 220] }
  })

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.grandTotal, 0)
  const finalY = doc.lastAutoTable.finalY

  doc.setFontSize(10)
  doc.text(`Total Invoices: ${invoices.length}`, 15, finalY + 10)
  doc.text(`Total Amount: LKR ${totalAmount.toFixed(2)}`, 15, finalY + 15)

  doc.save(`invoice_list_${new Date().toISOString().slice(0, 10)}.pdf`)
}


export const generateInventoryPDF = (inventoryItems) => {
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.setTextColor(0, 0, 0)
  doc.text('ACC MOTORS', 105, 15, { align: 'center' })
  doc.setFontSize(14)
  doc.text('Inventory Report', 105, 22, { align: 'center' })
  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' })

  const tableData = inventoryItems.map(item => [
    item.itemId,
    item.itemName,
    item.supplierName,
    item.quantity,
    item.unitPrice.toFixed(2),
    item.dateReceived
  ])

  autoTable(doc, {
    startY: 35,
    head: [['Item ID', 'Item Name', 'Supplier', 'Qty', 'Unit Price (LKR)', 'Date']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [220, 220, 220] }
  })

  doc.save(`inventory_report_${new Date().toISOString().slice(0, 10)}.pdf`)
}