import { formatDate, formatCurrency } from '../utils/formatters';

export const InvoicePDFGenerator = ({ invoice }) => {
  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    
    // Calculate totals for CreateInvoice format
    const isCreateInvoiceFormat = invoice.customerDetails;
    let partsTotal = 0;
    let totalAmount = 0;
    let netAmount = 0;
    
    if (isCreateInvoiceFormat) {
      partsTotal = invoice.serviceDetails.sparePartsUsed.reduce(
        (sum, part) => sum + (part.quantity * part.unitPrice), 0
      );
      totalAmount = invoice.serviceDetails.serviceCost + partsTotal;
      netAmount = totalAmount - invoice.discount;
    }

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
            <span>Date: ${formatDate(isCreateInvoiceFormat ? new Date() : invoice.issuedAt)}</span>
          </div>
          
          <div style="margin: 10px 0;">
            <strong>Customer Details:</strong><br>
            Name: ${isCreateInvoiceFormat ? invoice.customerDetails.name : invoice.customer?.name || 'N/A'}<br>
            Vehicle: ${isCreateInvoiceFormat ? invoice.customerDetails.vehicleRegNo : invoice.customer?.vehicleRegNo || 'N/A'}<br>
            Mobile: ${isCreateInvoiceFormat ? invoice.customerDetails.mobile : invoice.customer?.mobile || 'N/A'}
          </div>
          
          <div style="margin: 10px 0;">
            <strong>Service Details:</strong><br>
            KM: ${isCreateInvoiceFormat ? invoice.serviceDetails.km : invoice.service?.km || 'N/A'}<br>
            Description: ${isCreateInvoiceFormat ? invoice.serviceDetails.description : invoice.service?.description || 'N/A'}
          </div>
          
          ${isCreateInvoiceFormat 
            ? invoice.serviceDetails.sparePartsUsed.length > 0 ? `
              <div style="margin: 10px 0;">
                <strong>Parts Used:</strong><br>
                ${invoice.serviceDetails.sparePartsUsed.map(part => `
                  ${part.item || 'N/A'} - 
                  ${part.quantity} x ${formatCurrency(part.unitPrice)} = 
                  ${formatCurrency(part.quantity * part.unitPrice)}<br>
                `).join('')}
              </div>
              ` : ''
            : invoice.service?.sparePartsUsed?.length > 0 ? `
              <div style="margin: 10px 0;">
                <strong>Parts Used:</strong><br>
                ${invoice.service.sparePartsUsed.map(part => `
                  ${part.item?.name || 'N/A'} - 
                  ${part.quantity} x ${formatCurrency(part.unitPrice)} = 
                  ${formatCurrency(part.quantity * part.unitPrice)}<br>
                `).join('')}
              </div>
              ` : ''
          }
          
          <div class="total">
            <div class="row">
              <span>Service Cost:</span>
              <span>${formatCurrency(isCreateInvoiceFormat ? invoice.serviceDetails.serviceCost : invoice.service?.serviceCost || 0)}</span>
            </div>
            <div class="row">
              <span>Parts Total:</span>
              <span>${formatCurrency(isCreateInvoiceFormat 
                ? partsTotal 
                : invoice.service?.sparePartsUsed?.reduce((sum, part) => sum + (part.quantity * part.unitPrice), 0) || 0)}</span>
            </div>
            <div class="row">
              <span>Total:</span>
              <span>${formatCurrency(isCreateInvoiceFormat ? totalAmount : invoice.totalAmount || 0)}</span>
            </div>
            <div class="row">
              <span>Discount:</span>
              <span>${formatCurrency(invoice.discount || 0)}</span>
            </div>
            <div class="row">
              <strong>Net Amount:</strong>
              <strong>${formatCurrency(isCreateInvoiceFormat ? netAmount : invoice.netAmount || 0)}</strong>
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

  return { generatePDF };
};