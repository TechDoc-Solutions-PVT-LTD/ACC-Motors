export const saveInvoice = (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      // Get existing invoices from localStorage
      const existingInvoices = JSON.parse(localStorage.getItem('invoices')) || []
      
      // Add new invoice
      const updatedInvoices = [...existingInvoices, { ...invoice, id: Date.now() }]
      
      // Save back to localStorage
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices))
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export const getInvoices = () => {
  return new Promise((resolve, reject) => {
    try {
      const invoices = JSON.parse(localStorage.getItem('invoices')) || []
      resolve(invoices)
    } catch (error) {
      reject(error)
    }
  })
}