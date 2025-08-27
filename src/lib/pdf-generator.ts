import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Company information
const COMPANY_INFO = {
  name: '99 Club',
  address: 'Baghdad, Iraq',
  phone: '+964 XXX XXX XXXX',
  email: 'info@99club.com',
  website: 'www.99club.com',
  taxOffice: 'Baghdad Tax Office',
  taxNumber: 'TAX-99-CLUB-2024'
};

// Brand colors
const COLORS = {
  primary: '#D4AF37', // Gold
  secondary: '#1F2937', // Dark gray
  text: '#374151', // Medium gray
  light: '#F9FAFB', // Light gray
  white: '#FFFFFF'
};

interface PaymentDetails {
  invoiceNumber: string;
  status: string;
  description: string;
  notes: string;
  date: string;
  transactionId: string;
  receiptNumber: string;
  paymentMethod: string;
  amount: string;
  currency: string;
}

interface BillDetails {
  invoiceNumber: string;
  status: string;
  title: string;
  description: string;
  dueDate: string;
  billType: string;
  amount: string;
  currency: string;
  propertyName?: string;
  assignedToName?: string;
}

interface Translations {
  payments?: {
    detail: {
      invoice: string;
      companyInfo: string;
      taxOffice: string;
      taxNumber: string;
      invoiceDate: string;
      transactionId: string;
      receiptNumber: string;
      paymentStatus: string;
      paymentMethod: string;
      totalAmount: string;
      invoiceFooter: string;
      contactInfo: string;
      customerService: string;
    };
    status: {
      completed: string;
      pending: string;
    };
  };
  bills?: {
    detail: {
      invoice: string;
      companyInfo: string;
      taxOffice: string;
      taxNumber: string;
      dueDate: string;
      billType: string;
      documentNumber: string;
      billStatus: string;
      property: string;
      assignedTo: string;
      totalAmount: string;
      invoiceFooter: string;
      contactInfo: string;
      customerService: string;
    };
    status: {
      paid: string;
      pending: string;
    };
  };
}

/**
 * Generate PDF for payment receipt
 */
export const generatePaymentPDF = async (
  paymentDetails: PaymentDetails,
  translations: Translations
): Promise<void> => {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Set font
    pdf.setFont('helvetica');
    
    // Header with company name and logo area
    pdf.setFillColor(212, 175, 55); // Gold color
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // Company name
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(COMPANY_INFO.name, 20, 25);
    
    // Document title
    pdf.setTextColor(31, 41, 55);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(translations.payments?.detail.invoice || 'Payment Receipt', 20, 60);
    
    // Company information section
    let yPos = 80;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(55, 65, 81);
    
    pdf.text(`${translations.payments?.detail.companyInfo || 'Company Information'}:`, 20, yPos);
    yPos += 8;
    pdf.text(COMPANY_INFO.name, 20, yPos);
    yPos += 6;
    pdf.text(COMPANY_INFO.address, 20, yPos);
    yPos += 6;
    pdf.text(`${translations.payments?.detail.taxOffice || 'Tax Office'}: ${COMPANY_INFO.taxOffice}`, 20, yPos);
    yPos += 6;
    pdf.text(`${translations.payments?.detail.taxNumber || 'Tax Number'}: ${COMPANY_INFO.taxNumber}`, 20, yPos);
    
    // Payment details section
    yPos += 20;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Payment Details:', 20, yPos);
    yPos += 10;
    
    pdf.setFont('helvetica', 'normal');
    const details = [
      [`${translations.payments?.detail.invoiceDate || 'Date'}:`, paymentDetails.date],
      [`${translations.payments?.detail.transactionId || 'Transaction ID'}:`, paymentDetails.transactionId],
      [`${translations.payments?.detail.receiptNumber || 'Receipt Number'}:`, paymentDetails.receiptNumber],
      [`${translations.payments?.detail.paymentStatus || 'Status'}:`, translations.payments?.status[paymentDetails.status.toLowerCase() as keyof typeof translations.payments.status] || paymentDetails.status],
      [`${translations.payments?.detail.paymentMethod || 'Payment Method'}:`, paymentDetails.paymentMethod],
      ['Description:', paymentDetails.description]
    ];
    
    details.forEach(([label, value]) => {
      pdf.text(label, 20, yPos);
      pdf.text(value, 100, yPos);
      yPos += 8;
    });
    
    if (paymentDetails.notes) {
      yPos += 5;
      pdf.text('Notes:', 20, yPos);
      yPos += 8;
      pdf.text(paymentDetails.notes, 20, yPos);
      yPos += 10;
    }
    
    // Amount section with background
    yPos += 10;
    pdf.setFillColor(249, 250, 251);
    pdf.rect(15, yPos - 5, pageWidth - 30, 25, 'F');
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(212, 175, 55);
    pdf.text(`${translations.payments?.detail.totalAmount || 'Total Amount'}:`, 20, yPos + 8);
    pdf.text(`${paymentDetails.amount} ${paymentDetails.currency}`, pageWidth - 80, yPos + 8);
    
    // Footer
    yPos = pageHeight - 40;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(107, 114, 128);
    pdf.text(translations.payments?.detail.invoiceFooter || 'Thank you for your business!', 20, yPos);
    yPos += 6;
    pdf.text(`${translations.payments?.detail.contactInfo || 'Contact'}: ${COMPANY_INFO.phone} | ${COMPANY_INFO.email}`, 20, yPos);
    
    // Save the PDF
    const fileName = `payment-receipt-${paymentDetails.receiptNumber}-${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);
    
  } catch (error) {
    console.error('Error generating payment PDF:', error);
    throw new Error('Failed to generate payment PDF');
  }
};

/**
 * Generate PDF for bill invoice
 */
export const generateBillPDF = async (
  billDetails: BillDetails,
  translations: Translations
): Promise<void> => {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Set font
    pdf.setFont('helvetica');
    
    // Header with company name and logo area
    pdf.setFillColor(212, 175, 55); // Gold color
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // Company name
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(COMPANY_INFO.name, 20, 25);
    
    // Document title
    pdf.setTextColor(31, 41, 55);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(translations.bills?.detail.invoice || 'Bill Invoice', 20, 60);
    
    // Company information section
    let yPos = 80;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(55, 65, 81);
    
    pdf.text(`${translations.bills?.detail.companyInfo || 'Company Information'}:`, 20, yPos);
    yPos += 8;
    pdf.text(COMPANY_INFO.name, 20, yPos);
    yPos += 6;
    pdf.text(COMPANY_INFO.address, 20, yPos);
    yPos += 6;
    pdf.text(`${translations.bills?.detail.taxOffice || 'Tax Office'}: ${COMPANY_INFO.taxOffice}`, 20, yPos);
    yPos += 6;
    pdf.text(`${translations.bills?.detail.taxNumber || 'Tax Number'}: ${COMPANY_INFO.taxNumber}`, 20, yPos);
    
    // Bill details section
    yPos += 20;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bill Details:', 20, yPos);
    yPos += 10;
    
    pdf.setFont('helvetica', 'normal');
    const details = [
      [`${translations.bills?.detail.documentNumber || 'Document Number'}:`, billDetails.invoiceNumber],
      [`${translations.bills?.detail.dueDate || 'Due Date'}:`, billDetails.dueDate],
      [`${translations.bills?.detail.billType || 'Bill Type'}:`, billDetails.billType],
      [`${translations.bills?.detail.billStatus || 'Status'}:`, translations.bills?.status[billDetails.status.toLowerCase() as keyof typeof translations.bills.status] || billDetails.status],
      ['Title:', billDetails.title],
      ['Description:', billDetails.description]
    ];
    
    if (billDetails.propertyName) {
      details.push([`${translations.bills?.detail.property || 'Property'}:`, billDetails.propertyName]);
    }
    
    if (billDetails.assignedToName) {
      details.push([`${translations.bills?.detail.assignedTo || 'Assigned To'}:`, billDetails.assignedToName]);
    }
    
    details.forEach(([label, value]) => {
      pdf.text(label, 20, yPos);
      pdf.text(value, 100, yPos);
      yPos += 8;
    });
    
    // Amount section with background
    yPos += 10;
    pdf.setFillColor(249, 250, 251);
    pdf.rect(15, yPos - 5, pageWidth - 30, 25, 'F');
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(212, 175, 55);
    pdf.text(`${translations.bills?.detail.totalAmount || 'Total Amount'}:`, 20, yPos + 8);
    pdf.text(`${billDetails.amount} ${billDetails.currency}`, pageWidth - 80, yPos + 8);
    
    // Footer
    yPos = pageHeight - 40;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(107, 114, 128);
    pdf.text(translations.bills?.detail.invoiceFooter || 'Please pay this bill by the due date', 20, yPos);
    yPos += 6;
    pdf.text(`${translations.bills?.detail.contactInfo || 'Contact'}: ${COMPANY_INFO.phone} | ${COMPANY_INFO.email}`, 20, yPos);
    
    // Save the PDF
    const fileName = `bill-invoice-${billDetails.invoiceNumber}-${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);
    
  } catch (error) {
    console.error('Error generating bill PDF:', error);
    throw new Error('Failed to generate bill PDF');
  }
};

/**
 * Generate HTML for payment printing
 */
export const generatePaymentPDFForPrint = async (
  paymentDetails: PaymentDetails,
  translations: Translations
): Promise<void> => {
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window');
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt - ${paymentDetails.receiptNumber}</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #D4AF37, #B8941F);
            color: white;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .document-title {
            font-size: 20px;
            margin-top: 20px;
            color: #1F2937;
            text-align: center;
          }
          .section {
            margin-bottom: 25px;
            padding: 20px;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1F2937;
            margin-bottom: 15px;
            border-bottom: 2px solid #D4AF37;
            padding-bottom: 5px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
          }
          .detail-label {
            font-weight: 600;
            color: #374151;
          }
          .detail-value {
            color: #6B7280;
          }
          .amount-section {
            background: #F9FAFB;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
          }
          .amount-label {
            font-size: 18px;
            font-weight: bold;
            color: #D4AF37;
          }
          .amount-value {
            font-size: 24px;
            font-weight: bold;
            color: #1F2937;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            color: #6B7280;
            font-size: 12px;
          }
          .print-button {
            background: #D4AF37;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 20px auto;
            display: block;
          }
        </style>
      </head>
      <body>
        <button class="print-button no-print" onclick="window.print()">Print Receipt</button>
        
        <div class="header">
          <div class="company-name">${COMPANY_INFO.name}</div>
          <div>${COMPANY_INFO.address}</div>
        </div>
        
        <div class="document-title">${translations.payments?.detail.invoice || 'Payment Receipt'}</div>
        
        <div class="section">
          <div class="section-title">${translations.payments?.detail.companyInfo || 'Company Information'}</div>
          <div class="detail-row">
            <span class="detail-label">Company:</span>
            <span class="detail-value">${COMPANY_INFO.name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${translations.payments?.detail.taxOffice || 'Tax Office'}:</span>
            <span class="detail-value">${COMPANY_INFO.taxOffice}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${translations.payments?.detail.taxNumber || 'Tax Number'}:</span>
            <span class="detail-value">${COMPANY_INFO.taxNumber}</span>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Payment Details</div>
          <div class="detail-row">
            <span class="detail-label">${translations.payments?.detail.invoiceDate || 'Date'}:</span>
            <span class="detail-value">${paymentDetails.date}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${translations.payments?.detail.transactionId || 'Transaction ID'}:</span>
            <span class="detail-value">${paymentDetails.transactionId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${translations.payments?.detail.receiptNumber || 'Receipt Number'}:</span>
            <span class="detail-value">${paymentDetails.receiptNumber}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${translations.payments?.detail.paymentStatus || 'Status'}:</span>
            <span class="detail-value">${translations.payments?.status[paymentDetails.status.toLowerCase() as keyof typeof translations.payments.status] || paymentDetails.status}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${translations.payments?.detail.paymentMethod || 'Payment Method'}:</span>
            <span class="detail-value">${paymentDetails.paymentMethod}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Description:</span>
            <span class="detail-value">${paymentDetails.description}</span>
          </div>
          ${paymentDetails.notes ? `
          <div class="detail-row">
            <span class="detail-label">Notes:</span>
            <span class="detail-value">${paymentDetails.notes}</span>
          </div>` : ''}
        </div>
        
        <div class="amount-section">
          <div class="amount-label">${translations.payments?.detail.totalAmount || 'Total Amount'}</div>
          <div class="amount-value">${paymentDetails.amount} ${paymentDetails.currency}</div>
        </div>
        
        <div class="footer">
          <p>${translations.payments?.detail.invoiceFooter || 'Thank you for your business!'}</p>
          <p>${translations.payments?.detail.contactInfo || 'Contact'}: ${COMPANY_INFO.phone} | ${COMPANY_INFO.email}</p>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then focus for printing
    setTimeout(() => {
      printWindow.focus();
    }, 500);
    
  } catch (error) {
    console.error('Error generating payment print HTML:', error);
    throw new Error('Failed to generate payment print HTML');
  }
};

/**
 * Generate HTML for bill printing
 */
export const generateBillPDFForPrint = async (
  billDetails: BillDetails,
  translations: Translations
): Promise<void> => {
  try {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window');
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill Invoice - ${billDetails.invoiceNumber}</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #D4AF37, #B8941F);
            color: white;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .document-title {
            font-size: 20px;
            margin-top: 20px;
            color: #1F2937;
            text-align: center;
          }
          .section {
            margin-bottom: 25px;
            padding: 20px;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1F2937;
            margin-bottom: 15px;
            border-bottom: 2px solid #D4AF37;
            padding-bottom: 5px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
          }
          .detail-label {
            font-weight: 600;
            color: #374151;
          }
          .detail-value {
            color: #6B7280;
          }
          .amount-section {
            background: #F9FAFB;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
          }
          .amount-label {
            font-size: 18px;
            font-weight: bold;
            color: #D4AF37;
          }
          .amount-value {
            font-size: 24px;
            font-weight: bold;
            color: #1F2937;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            color: #6B7280;
            font-size: 12px;
          }
          .print-button {
            background: #D4AF37;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 20px auto;
            display: block;
          }
        </style>
      </head>
      <body>
        <button class="print-button no-print" onclick="window.print()">Print Bill</button>
        
        <div class="header">
          <div class="company-name">${COMPANY_INFO.name}</div>
          <div>${COMPANY_INFO.address}</div>
        </div>
        
        <div class="document-title">${translations.bills?.detail.invoice || 'Bill Invoice'}</div>
        
        <div class="section">
          <div class="section-title">${translations.bills?.detail.companyInfo || 'Company Information'}</div>
          <div class="detail-row">
            <span class="detail-label">Company:</span>
            <span class="detail-value">${COMPANY_INFO.name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${translations.bills?.detail.taxOffice || 'Tax Office'}:</span>
            <span class="detail-value">${COMPANY_INFO.taxOffice}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${translations.bills?.detail.taxNumber || 'Tax Number'}:</span>
            <span class="detail-value">${COMPANY_INFO.taxNumber}</span>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Bill Details</div>
          <div class="detail-row">
            <span class="detail-label">${translations.bills?.detail.documentNumber || 'Document Number'}:</span>
            <span class="detail-value">${billDetails.invoiceNumber}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${translations.bills?.detail.dueDate || 'Due Date'}:</span>
            <span class="detail-value">${billDetails.dueDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${translations.bills?.detail.billType || 'Bill Type'}:</span>
            <span class="detail-value">${billDetails.billType}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">${translations.bills?.detail.billStatus || 'Status'}:</span>
            <span class="detail-value">${translations.bills?.status[billDetails.status.toLowerCase() as keyof typeof translations.bills.status] || billDetails.status}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Title:</span>
            <span class="detail-value">${billDetails.title}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Description:</span>
            <span class="detail-value">${billDetails.description}</span>
          </div>
          ${billDetails.propertyName ? `
          <div class="detail-row">
            <span class="detail-label">${translations.bills?.detail.property || 'Property'}:</span>
            <span class="detail-value">${billDetails.propertyName}</span>
          </div>` : ''}
          ${billDetails.assignedToName ? `
          <div class="detail-row">
            <span class="detail-label">${translations.bills?.detail.assignedTo || 'Assigned To'}:</span>
            <span class="detail-value">${billDetails.assignedToName}</span>
          </div>` : ''}
        </div>
        
        <div class="amount-section">
          <div class="amount-label">${translations.bills?.detail.totalAmount || 'Total Amount'}</div>
          <div class="amount-value">${billDetails.amount} ${billDetails.currency}</div>
        </div>
        
        <div class="footer">
          <p>${translations.bills?.detail.invoiceFooter || 'Please pay this bill by the due date'}</p>
          <p>${translations.bills?.detail.contactInfo || 'Contact'}: ${COMPANY_INFO.phone} | ${COMPANY_INFO.email}</p>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then focus for printing
    setTimeout(() => {
      printWindow.focus();
    }, 500);
    
  } catch (error) {
    console.error('Error generating bill print HTML:', error);
    throw new Error('Failed to generate bill print HTML');
  }
};

/**
 * Generate a generic PDF document
 * This is a more flexible function that can be used for various document types
 */
export const generateGenericPDF = async (
  title: string,
  content: { label: string; value: string }[],
  options?: {
    fileName?: string;
    headerColor?: string;
    companyInfo?: typeof COMPANY_INFO;
    footer?: string;
  }
): Promise<void> => {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const companyInfo = options?.companyInfo || COMPANY_INFO;
    
    // Set font
    pdf.setFont('helvetica');
    
    // Header with company name
    const headerColor = options?.headerColor || COLORS.primary;
    const [r, g, b] = headerColor.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [212, 175, 55];
    pdf.setFillColor(r, g, b);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // Company name
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(companyInfo.name, 20, 25);
    
    // Document title
    pdf.setTextColor(31, 41, 55);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, 20, 60);
    
    // Content
    let yPos = 80;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(55, 65, 81);
    
    content.forEach(({ label, value }) => {
      pdf.text(`${label}:`, 20, yPos);
      pdf.text(value, 100, yPos);
      yPos += 8;
    });
    
    // Footer
    if (options?.footer) {
      const footerY = pageHeight - 20;
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text(options.footer, 20, footerY);
    }
    
    // Save the PDF
    const fileName = options?.fileName || `document-${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);
    
  } catch (error) {
    console.error('Error generating generic PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

/**
 * Generate HTML-based PDF for payment receipt with professional styling
 */
export const generateHTMLReceiptPDF = async (
  paymentDetails: PaymentDetails,
  translations: Translations,
  options?: {
    download?: boolean;
    print?: boolean;
    fileName?: string;
  }
): Promise<void> => {
  try {
    const t = translations.payments?.detail || {};
    
    // Create a temporary div element in the current document
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '210mm';
    tempDiv.style.background = '#ffffff';
    
    const html = `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 20px;
        background-color: #f5f5f5;
        color: #333;
      ">
        <div style="
          background-color: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          max-width: 650px;
          margin: 0 auto;
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #FFD700;
          ">
            <div style="
              display: flex;
              align-items: center;
              gap: 15px;
            ">
              <div style="
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #FFD700, #FFA500);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: bold;
                color: #000;
                box-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
              ">99</div>
            </div>
            <div style="flex: 1;">
              <div style="
                font-size: 28px;
                font-weight: bold;
                color: #333;
                margin: 0;
                letter-spacing: 1px;
              ">${COMPANY_INFO.name}</div>
              <div style="
                font-size: 12px;
                color: #666;
                margin: 2px 0 0 0;
                font-style: italic;
              ">Premium Property Management</div>
            </div>
            <div style="text-align: right;">
              <div style="
                font-size: 32px;
                font-weight: bold;
                color: #333;
                margin: 0;
                letter-spacing: 2px;
              ">${translations.payments?.detail?.invoice || 'Invoice'}</div>
              <div style="
                font-size: 14px;
                color: #666;
                margin: 5px 0;
              ">#${paymentDetails.invoiceNumber}</div>
              <div style="
                display: inline-block;
                padding: 8px 16px;
                border-radius: 25px;
                font-size: 12px;
                font-weight: bold;
                margin-top: 10px;
                background-color: ${paymentDetails.status === 'COMPLETED' ? '#d4edda' : '#f8d7da'};
                color: ${paymentDetails.status === 'COMPLETED' ? '#155724' : '#721c24'};
                border: 2px solid ${paymentDetails.status === 'COMPLETED' ? '#c3e6cb' : '#f5c6cb'};
              ">${paymentDetails.status}</div>
            </div>
          </div>
          
          <div style="
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 25px;
            border-left: 4px solid #FFD700;
          ">
            <h3 style="
              margin: 0 0 10px 0;
              color: #333;
              font-size: 16px;
              font-weight: bold;
            ">${translations.payments?.detail?.companyInfo || 'Company Information'}</h3>
            <div style="
              font-size: 13px;
              line-height: 1.6;
              color: #555;
            ">
              <strong>${COMPANY_INFO.name}</strong><br>
              ${COMPANY_INFO.address}<br>
              ${translations.payments?.detail?.taxOffice || 'Tax Office'}: ${COMPANY_INFO.taxOffice}<br>
              ${translations.payments?.detail?.taxNumber || 'Tax Number'}: ${COMPANY_INFO.taxNumber}<br>
              Phone: ${COMPANY_INFO.phone}<br>
              Email: ${COMPANY_INFO.email}
            </div>
          </div>
          
          <div style="
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 25px;
            border-left: 4px solid #FFD700;
          ">
            <div style="
              font-size: 18px;
              font-weight: bold;
              color: #333;
              margin-bottom: 8px;
            ">${paymentDetails.description}</div>
            <div style="
              font-size: 14px;
              color: #666;
              font-style: italic;
            ">Payment Receipt</div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <div style="
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #eee;
            ">
              <span style="
                font-weight: bold;
                color: #333;
                font-size: 14px;
              ">${translations.payments?.detail?.invoiceDate || 'Invoice Date'}:</span>
              <span style="
                color: #666;
                font-size: 14px;
              ">${paymentDetails.date}</span>
            </div>
            <div style="
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #eee;
            ">
              <span style="
                font-weight: bold;
                color: #333;
                font-size: 14px;
              ">${translations.payments?.detail?.transactionId || 'Transaction ID'}:</span>
              <span style="
                color: #666;
                font-size: 14px;
              ">${paymentDetails.transactionId}</span>
            </div>
            <div style="
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #eee;
            ">
              <span style="
                font-weight: bold;
                color: #333;
                font-size: 14px;
              ">${translations.payments?.detail?.receiptNumber || 'Receipt Number'}:</span>
              <span style="
                color: #666;
                font-size: 14px;
              ">${paymentDetails.receiptNumber}</span>
            </div>
            <div style="
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #eee;
            ">
              <span style="
                font-weight: bold;
                color: #333;
                font-size: 14px;
              ">${translations.payments?.detail?.paymentStatus || 'Payment Status'}:</span>
              <span style="
                color: #666;
                font-size: 14px;
              ">${paymentDetails.status}</span>
            </div>
            <div style="
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
            ">
              <span style="
                font-weight: bold;
                color: #333;
                font-size: 14px;
              ">${translations.payments?.detail?.paymentMethod || 'Payment Method'}:</span>
              <span style="
                color: #666;
                font-size: 14px;
              ">${paymentDetails.paymentMethod}</span>
            </div>
          </div>
          
          <div style="
            background: linear-gradient(135deg, #e8f5e8, #d4edda);
            padding: 25px;
            border-radius: 12px;
            margin-top: 25px;
            border: 2px solid #c3e6cb;
          ">
            <div style="
              display: flex;
              justify-content: space-between;
              font-size: 20px;
              font-weight: bold;
              color: #155724;
            ">
              <span>💰 ${translations.payments?.detail?.totalAmount || 'Total Amount'}:</span>
              <span>${paymentDetails.amount} ${paymentDetails.currency}</span>
            </div>
          </div>
          
          <div style="
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #eee;
          ">
            <div style="
              font-size: 12px;
              color: #666;
              line-height: 1.5;
            ">
              <strong>${translations.payments?.detail?.invoiceFooter || 'Thank you for your business!'}</strong><br>
              ${translations.payments?.detail?.contactInfo || 'For any questions, please contact us'}
            </div>
            <div style="
              margin-top: 10px;
              font-size: 11px;
              color: #888;
            ">
              ${translations.payments?.detail?.customerService || 'Customer Service'}: ${COMPANY_INFO.phone} | ${COMPANY_INFO.email}
            </div>
          </div>
        </div>
      `;

      // Create a temporary div element to render the HTML
      const receiptDiv = document.createElement('div');
      receiptDiv.innerHTML = htmlContent;
      receiptDiv.style.position = 'absolute';
      receiptDiv.style.left = '-9999px';
      receiptDiv.style.top = '-9999px';
      receiptDiv.style.width = '210mm';
      receiptDiv.style.height = 'auto';
      document.body.appendChild(receiptDiv);

      try {
        if (opt.print) {
          // For printing, create a new window with the content
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <title>Receipt</title>
                  <style>
                    @media print {
                      body { margin: 0; background: white; }
                      * { box-shadow: none !important; }
                    }
                  </style>
                </head>
                <body>
                  ${htmlContent}
                </body>
              </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
          }
        }

        if (opt.download) {
          // For download, use html2canvas and jsPDF
          const canvas = await html2canvas(receiptDiv, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: receiptDiv.scrollWidth,
            height: receiptDiv.scrollHeight
          });

          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          const imgWidth = 210;
          const pageHeight = 295;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;

          let position = 0;

          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          pdf.save(opt.filename);
        }
      } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
      } finally {
        // Clean up the temporary element
        document.body.removeChild(receiptDiv);
      }
    } catch (error) {
      console.error('Error generating HTML receipt PDF:', error);
      throw new Error('Failed to generate HTML receipt PDF');
    }
  };

/**
 * Generate HTML-based PDF for bill invoice with professional styling
 */
export const generateHTMLBillPDF = async (
  billDetails: BillDetails,
  translations: Translations,
  options?: {
    download?: boolean;
    print?: boolean;
    fileName?: string;
  }
): Promise<void> => {
  try {
    // Create a temporary div element to render the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '210mm';
    tempDiv.style.minHeight = '297mm';
    tempDiv.style.backgroundColor = '#ffffff';
    
    // Inline CSS styles for the bill
    tempDiv.innerHTML = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; background-color: #f5f5f5; color: #333;">
        <div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 650px; margin: 0 auto;">
          <!-- Company Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #FFD700;">
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #FFD700, #FFA500); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #000; box-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);">99</div>
              <div>
                <h1 style="font-size: 28px; font-weight: bold; color: #333; margin: 0; letter-spacing: 1px;">${COMPANY_INFO.name}</h1>
                <p style="font-size: 12px; color: #666; margin: 2px 0 0 0; font-style: italic;">Premium Service Provider</p>
              </div>
            </div>
            <div style="text-align: right;">
              <h2 style="font-size: 32px; font-weight: bold; color: #333; margin: 0; letter-spacing: 2px;">${translations.bills?.detail?.invoice || 'INVOICE'}</h2>
              <p style="font-size: 14px; color: #666; margin: 5px 0;">#${billDetails.invoiceNumber}</p>
              <span style="display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; ${billDetails.status === 'paid' ? 'background-color: #10B981; color: white;' : 'background-color: #F59E0B; color: white;'}">${billDetails.status === 'paid' ? (translations.bills?.status?.paid || 'PAID') : (translations.bills?.status?.pending || 'PENDING')}</span>
            </div>
          </div>

          <!-- Company Details -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
            <div>
              <h3 style="font-size: 16px; font-weight: bold; color: #333; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">${translations.bills?.detail?.companyInfo || 'Company Information'}</h3>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #FFD700;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #555;"><strong>${COMPANY_INFO.name}</strong></p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #555;">${COMPANY_INFO.address}</p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #555;">${COMPANY_INFO.phone}</p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #555;">${COMPANY_INFO.email}</p>
                <p style="margin: 0; font-size: 14px; color: #555;">${COMPANY_INFO.website}</p>
              </div>
            </div>
            <div>
              <h3 style="font-size: 16px; font-weight: bold; color: #333; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">Tax Information</h3>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #FFD700;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #555;"><strong>${translations.bills?.detail?.taxOffice || 'Tax Office'}:</strong> ${COMPANY_INFO.taxOffice}</p>
                <p style="margin: 0; font-size: 14px; color: #555;"><strong>${translations.bills?.detail?.taxNumber || 'Tax Number'}:</strong> ${COMPANY_INFO.taxNumber}</p>
              </div>
            </div>
          </div>

          <!-- Service Information -->
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e9ecef;">
            <h3 style="font-size: 18px; font-weight: bold; color: #333; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px;">Service Details</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Service:</strong></p>
                <p style="margin: 0 0 15px 0; font-size: 16px; color: #333; font-weight: 500;">${billDetails.title}</p>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>Description:</strong></p>
                <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.5;">${billDetails.description}</p>
              </div>
              <div>
                ${billDetails.propertyName ? `<p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>${translations.bills?.detail?.property || 'Property'}:</strong></p><p style="margin: 0 0 15px 0; font-size: 14px; color: #333;">${billDetails.propertyName}</p>` : ''}
                ${billDetails.assignedToName ? `<p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>${translations.bills?.detail?.assignedTo || 'Assigned To'}:</strong></p><p style="margin: 0 0 15px 0; font-size: 14px; color: #333;">${billDetails.assignedToName}</p>` : ''}
              </div>
            </div>
          </div>

          <!-- Bill Details -->
          <div style="background-color: #fff; border: 2px solid #FFD700; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h3 style="font-size: 18px; font-weight: bold; color: #333; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px;">Bill Information</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <p style="margin: 0 0 5px 0; font-size: 14px; color: #666; font-weight: 500;">${translations.bills?.detail?.dueDate || 'Due Date'}:</p>
                <p style="margin: 0 0 15px 0; font-size: 16px; color: #333; font-weight: bold;">${billDetails.dueDate}</p>
                <p style="margin: 0 0 5px 0; font-size: 14px; color: #666; font-weight: 500;">${translations.bills?.detail?.billType || 'Bill Type'}:</p>
                <p style="margin: 0; font-size: 16px; color: #333; font-weight: bold;">${billDetails.billType}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; font-size: 14px; color: #666; font-weight: 500;">${translations.bills?.detail?.documentNumber || 'Document Number'}:</p>
                <p style="margin: 0 0 15px 0; font-size: 16px; color: #333; font-weight: bold;">${billDetails.invoiceNumber}</p>
                <p style="margin: 0 0 5px 0; font-size: 14px; color: #666; font-weight: 500;">${translations.bills?.detail?.billStatus || 'Bill Status'}:</p>
                <p style="margin: 0; font-size: 16px; color: #333; font-weight: bold;">${billDetails.status}</p>
              </div>
            </div>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="margin: 0 0 10px 0; font-size: 16px; color: #666; font-weight: 500;">${translations.bills?.detail?.totalAmount || 'Total Amount'}</p>
              <p style="margin: 0; font-size: 32px; color: #333; font-weight: bold; letter-spacing: 1px;">${billDetails.amount} ${billDetails.currency}</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 30px; border-top: 2px solid #e9ecef;">
            <p style="margin: 0 0 15px 0; font-size: 14px; color: #666; font-style: italic;">${translations.bills?.detail?.invoiceFooter || 'Thank you for choosing our services!'}</p>
            <div style="font-size: 12px; color: #999; line-height: 1.6;">
              www.99club.com | ${translations.bills?.detail?.customerService || 'Customer Service'}: +964 XXX XXX XXXX
            </div>
          </div>
        </div>
      </div>
    `;

    // Append to body temporarily
    document.body.appendChild(tempDiv);

    try {
      if (options?.print) {
        // For printing, create a new window with the content
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          throw new Error('Unable to open print window. Please allow popups for this site.');
        }
        
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Bill Invoice - ${billDetails.invoiceNumber}</title>
            <style>
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${tempDiv.innerHTML}
          </body>
          </html>
        `);
        printWindow.document.close();
        
        // Wait for content to load then print
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };
      } else if (options?.download !== false) {
        // For downloading, use html2canvas and jsPDF
        const canvas = await html2canvas(tempDiv, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          scale: 2
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const fileName = options?.fileName || `bill-invoice-${billDetails.invoiceNumber}.pdf`;
        pdf.save(fileName);
      }
    } catch (error) {
      console.error('Error generating bill PDF:', error);
      throw error;
    } finally {
      // Clean up the temporary element
      document.body.removeChild(tempDiv);
    }
  } catch (error) {
    console.error('Error generating HTML bill PDF:', error);
    throw new Error('Failed to generate HTML bill PDF');
  }
};