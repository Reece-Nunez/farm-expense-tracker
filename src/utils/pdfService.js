import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export class InvoicePDFGenerator {
  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.width;
    this.pageHeight = this.doc.internal.pageSize.height;
    this.margin = 20;
    this.contentWidth = this.pageWidth - (this.margin * 2);
  }

  generateInvoicePDF(invoice, farmInfo = {}) {
    try {
      this.doc = new jsPDF();
      this.currentY = this.margin;

      this.addHeader(farmInfo);
      this.addInvoiceInfo(invoice);
      this.addBillingInfo(invoice);
      this.addItemsTable(invoice);
      this.addTotals(invoice);
      this.addPaymentInfo(invoice);
      this.addFooter(farmInfo);

      return this.doc;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  addHeader(farmInfo) {
    const centerX = this.pageWidth / 2;

    // Farm Logo/Icon
    this.doc.setFillColor(34, 197, 94); // green-500
    this.doc.circle(centerX, this.currentY + 15, 12, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(16);
    this.doc.text('🌾', centerX - 4, this.currentY + 20);

    // Farm Name
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(24);
    this.doc.setFont(undefined, 'bold');
    const farmName = farmInfo.farmName || 'HarvesTrackr Farm';
    this.doc.text(farmName, centerX, this.currentY + 40, { align: 'center' });

    // Farm Address
    if (farmInfo.address) {
      this.doc.setFontSize(10);
      this.doc.setFont(undefined, 'normal');
      this.doc.setTextColor(100, 100, 100);
      const addressLines = this.formatAddress(farmInfo);
      let addressY = this.currentY + 50;
      
      addressLines.forEach(line => {
        this.doc.text(line, centerX, addressY, { align: 'center' });
        addressY += 12;
      });
      this.currentY = addressY + 10;
    } else {
      this.currentY += 60;
    }

    // INVOICE Title
    this.doc.setFontSize(32);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(34, 197, 94);
    this.doc.text('INVOICE', centerX, this.currentY, { align: 'center' });
    
    this.currentY += 25;
    this.addHorizontalLine();
  }

  addInvoiceInfo(invoice) {
    const leftCol = this.margin;
    const rightCol = this.pageWidth - this.margin - 60;

    this.doc.setFontSize(11);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(0, 0, 0);

    // Left column - Invoice details
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Invoice Number:', leftCol, this.currentY);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(invoice.invoiceNumber, leftCol + 35, this.currentY);

    this.doc.setFont(undefined, 'bold');
    this.doc.text('Invoice Date:', leftCol, this.currentY + 15);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(format(new Date(invoice.date), 'MMMM dd, yyyy'), leftCol + 30, this.currentY + 15);

    if (invoice.dueDate) {
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Due Date:', leftCol, this.currentY + 30);
      this.doc.setFont(undefined, 'normal');
      this.doc.text(format(new Date(invoice.dueDate), 'MMMM dd, yyyy'), leftCol + 25, this.currentY + 30);
    }

    // Right column - Status
    const statusColors = {
      DRAFT: [156, 163, 175], // gray-400
      SENT: [59, 130, 246], // blue-500
      PAID: [34, 197, 94], // green-500
      OVERDUE: [239, 68, 68], // red-500
      CANCELLED: [107, 114, 128] // gray-500
    };

    const statusColor = statusColors[invoice.status] || statusColors.DRAFT;
    this.doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    this.doc.roundedRect(rightCol - 10, this.currentY - 8, 50, 20, 5, 5, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont(undefined, 'bold');
    this.doc.setFontSize(10);
    this.doc.text(invoice.status, rightCol + 15, this.currentY + 2, { align: 'center' });

    this.currentY += 50;
  }

  addBillingInfo(invoice) {
    const leftCol = this.margin;
    const rightCol = this.pageWidth / 2 + 10;

    // Bill To section
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text('BILL TO:', leftCol, this.currentY);

    this.doc.setFontSize(11);
    this.doc.setFont(undefined, 'normal');
    
    let billToY = this.currentY + 15;
    
    if (invoice.customer) {
      this.doc.setFont(undefined, 'bold');
      this.doc.text(invoice.customer.name, leftCol, billToY);
      billToY += 12;
      
      this.doc.setFont(undefined, 'normal');
      
      if (invoice.customer.email) {
        this.doc.text(invoice.customer.email, leftCol, billToY);
        billToY += 12;
      }
      
      if (invoice.customer.phone) {
        this.doc.text(invoice.customer.phone, leftCol, billToY);
        billToY += 12;
      }
      
      // Address
      const addressLines = this.formatCustomerAddress(invoice.customer);
      addressLines.forEach(line => {
        this.doc.text(line, leftCol, billToY);
        billToY += 12;
      });
    }

    // Ship To section (if different)
    if (invoice.shippingAddress && this.isShippingDifferent(invoice)) {
      this.doc.setFontSize(12);
      this.doc.setFont(undefined, 'bold');
      this.doc.text('SHIP TO:', rightCol, this.currentY);

      this.doc.setFontSize(11);
      this.doc.setFont(undefined, 'normal');
      
      let shipToY = this.currentY + 15;
      const shippingLines = this.formatShippingAddress(invoice.shippingAddress);
      shippingLines.forEach(line => {
        this.doc.text(line, rightCol, shipToY);
        shipToY += 12;
      });
    }

    this.currentY = Math.max(billToY, this.currentY + 80);
    this.addHorizontalLine();
  }

  addItemsTable(invoice) {
    const tableData = invoice.products?.items?.map((item, index) => [
      index + 1,
      item.product?.name || item.description || 'Product',
      item.quantity?.toString() || '1',
      `$${(item.unitPrice || 0).toFixed(2)}`,
      `$${((item.quantity || 1) * (item.unitPrice || 0)).toFixed(2)}`
    ]) || [];

    this.doc.autoTable({
      startY: this.currentY + 10,
      head: [['#', 'Description', 'Qty', 'Rate', 'Amount']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [34, 197, 94], // green-500
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [0, 0, 0]
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        1: { cellWidth: 'auto' },
        2: { halign: 'center', cellWidth: 20 },
        3: { halign: 'right', cellWidth: 25 },
        4: { halign: 'right', cellWidth: 30 }
      },
      margin: { left: this.margin, right: this.margin },
      tableWidth: this.contentWidth,
      didDrawPage: (data) => {
        // Update currentY to position after table
        this.currentY = data.cursor.y;
      }
    });

    // Get the final position after the table
    this.currentY = this.doc.lastAutoTable.finalY + 10;
  }

  addTotals(invoice) {
    const rightAlign = this.pageWidth - this.margin;
    const labelCol = rightAlign - 80;
    const valueCol = rightAlign - 30;

    this.doc.setFontSize(11);
    this.doc.setFont(undefined, 'normal');

    let totalsY = this.currentY;

    // Subtotal
    this.doc.text('Subtotal:', labelCol, totalsY, { align: 'left' });
    this.doc.text(`$${(invoice.subtotal || 0).toFixed(2)}`, valueCol, totalsY, { align: 'right' });
    totalsY += 15;

    // Tax
    if (invoice.taxRate && invoice.taxRate > 0) {
      this.doc.text(`Tax (${(invoice.taxRate * 100).toFixed(1)}%):`, labelCol, totalsY, { align: 'left' });
      this.doc.text(`$${(invoice.tax || 0).toFixed(2)}`, valueCol, totalsY, { align: 'right' });
      totalsY += 15;
    }

    // Discount
    if (invoice.discount && invoice.discount > 0) {
      this.doc.text('Discount:', labelCol, totalsY, { align: 'left' });
      this.doc.text(`-$${invoice.discount.toFixed(2)}`, valueCol, totalsY, { align: 'right' });
      totalsY += 15;
    }

    // Total line
    this.doc.setLineWidth(0.5);
    this.doc.line(labelCol - 5, totalsY - 5, valueCol + 5, totalsY - 5);

    // Total
    this.doc.setFont(undefined, 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(34, 197, 94); // green-500
    this.doc.text('TOTAL:', labelCol, totalsY + 5, { align: 'left' });
    this.doc.text(`$${(invoice.total || 0).toFixed(2)}`, valueCol, totalsY + 5, { align: 'right' });

    this.currentY = totalsY + 25;
  }

  addPaymentInfo(invoice) {
    if (invoice.paymentTerms || invoice.notes) {
      this.addHorizontalLine();
      
      this.doc.setFontSize(11);
      this.doc.setFont(undefined, 'normal');
      this.doc.setTextColor(0, 0, 0);

      if (invoice.paymentTerms) {
        this.doc.setFont(undefined, 'bold');
        this.doc.text('Payment Terms:', this.margin, this.currentY);
        this.doc.setFont(undefined, 'normal');
        this.doc.text(invoice.paymentTerms, this.margin + 35, this.currentY);
        this.currentY += 20;
      }

      if (invoice.notes) {
        this.doc.setFont(undefined, 'bold');
        this.doc.text('Notes:', this.margin, this.currentY);
        this.doc.setFont(undefined, 'normal');
        
        // Handle multi-line notes
        const noteLines = this.doc.splitTextToSize(invoice.notes, this.contentWidth - 30);
        this.doc.text(noteLines, this.margin + 20, this.currentY);
        this.currentY += (noteLines.length * 12) + 10;
      }
    }
  }

  addFooter(farmInfo) {
    const footerY = this.pageHeight - 30;
    
    this.doc.setFontSize(9);
    this.doc.setFont(undefined, 'normal');
    this.doc.setTextColor(128, 128, 128);
    
    const centerX = this.pageWidth / 2;
    this.doc.text('Thank you for your business!', centerX, footerY, { align: 'center' });
    
    if (farmInfo.website || farmInfo.email) {
      let contactInfo = [];
      if (farmInfo.email) contactInfo.push(farmInfo.email);
      if (farmInfo.website) contactInfo.push(farmInfo.website);
      
      this.doc.text(contactInfo.join(' | '), centerX, footerY + 10, { align: 'center' });
    }

    // Generated timestamp
    this.doc.text(
      `Generated on ${format(new Date(), 'MMMM dd, yyyy HH:mm')}`,
      centerX,
      footerY + 20,
      { align: 'center' }
    );
  }

  addHorizontalLine() {
    this.doc.setLineWidth(0.3);
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, this.currentY + 5, this.pageWidth - this.margin, this.currentY + 5);
    this.currentY += 15;
  }

  formatAddress(farmInfo) {
    const lines = [];
    if (farmInfo.address) lines.push(farmInfo.address);
    
    const cityStateZip = [farmInfo.city, farmInfo.state, farmInfo.zipCode]
      .filter(Boolean)
      .join(', ');
    if (cityStateZip) lines.push(cityStateZip);
    
    if (farmInfo.country && farmInfo.country !== 'United States') {
      lines.push(farmInfo.country);
    }
    
    if (farmInfo.phone) lines.push(farmInfo.phone);
    if (farmInfo.email) lines.push(farmInfo.email);
    
    return lines;
  }

  formatCustomerAddress(customer) {
    const lines = [];
    if (customer.address) lines.push(customer.address);
    
    const cityStateZip = [customer.city, customer.state, customer.zipCode]
      .filter(Boolean)
      .join(', ');
    if (cityStateZip) lines.push(cityStateZip);
    
    if (customer.country && customer.country !== 'United States') {
      lines.push(customer.country);
    }
    
    return lines;
  }

  formatShippingAddress(shippingAddress) {
    const lines = [];
    if (shippingAddress.address) lines.push(shippingAddress.address);
    
    const cityStateZip = [shippingAddress.city, shippingAddress.state, shippingAddress.zipCode]
      .filter(Boolean)
      .join(', ');
    if (cityStateZip) lines.push(cityStateZip);
    
    if (shippingAddress.country && shippingAddress.country !== 'United States') {
      lines.push(shippingAddress.country);
    }
    
    return lines;
  }

  isShippingDifferent(invoice) {
    if (!invoice.shippingAddress || !invoice.customer) return false;
    
    const shipping = invoice.shippingAddress;
    const customer = invoice.customer;
    
    return shipping.address !== customer.address ||
           shipping.city !== customer.city ||
           shipping.state !== customer.state ||
           shipping.zipCode !== customer.zipCode ||
           shipping.country !== customer.country;
  }

  async downloadPDF(filename) {
    this.doc.save(filename);
  }

  getPDFBlob() {
    return this.doc.output('blob');
  }

  getPDFDataUri() {
    return this.doc.output('datauristring');
  }
}

export const generateInvoicePDF = async (invoice, farmInfo = {}) => {
  const generator = new InvoicePDFGenerator();
  const pdf = generator.generateInvoicePDF(invoice, farmInfo);
  
  return {
    pdf,
    download: (filename) => generator.downloadPDF(filename || `invoice-${invoice.invoiceNumber}.pdf`),
    getBlob: () => generator.getPDFBlob(),
    getDataUri: () => generator.getPDFDataUri()
  };
};

// Utility function for batch PDF generation
export const generateBatchInvoicePDFs = async (invoices, farmInfo = {}) => {
  const pdfs = [];
  
  for (const invoice of invoices) {
    try {
      const pdfResult = await generateInvoicePDF(invoice, farmInfo);
      pdfs.push({
        invoice: invoice.invoiceNumber,
        pdf: pdfResult,
        success: true
      });
    } catch (error) {
      pdfs.push({
        invoice: invoice.invoiceNumber,
        error: error.message,
        success: false
      });
    }
  }
  
  return pdfs;
};