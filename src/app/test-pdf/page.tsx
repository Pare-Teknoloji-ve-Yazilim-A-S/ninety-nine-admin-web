'use client';

import React, { useState } from 'react';
import Button from '@/app/components/ui/Button';
import { Download } from 'lucide-react';
import { generatePaymentPDF, generateBillPDF, generatePaymentPDFForPrint, generateBillPDFForPrint, generateHTMLReceiptPDF, generateHTMLBillPDF } from '@/lib/pdf-generator';

export default function TestPDFPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const testPaymentPDF = async () => {
    setIsGenerating(true);
    try {
      const testPaymentDetails = {
        invoiceNumber: 'TEST-001',
        status: 'COMPLETED',
        description: 'Test Payment',
        notes: 'This is a test payment for demonstration purposes',
        date: new Date().toLocaleDateString('tr-TR'),
        transactionId: 'TXN-123456',
        receiptNumber: 'RCPT-789',
        paymentMethod: 'CREDIT_CARD',
        amount: '150.00',
        currency: 'IQD'
      };

      await generatePaymentPDF(testPaymentDetails, {
        payments: {
          detail: {
            invoice: 'Invoice',
            companyInfo: 'Company Information',
            taxOffice: 'Tax Office',
            taxNumber: 'Tax Number',
            invoiceDate: 'Invoice Date',
            transactionId: 'Transaction ID',
            receiptNumber: 'Receipt Number',
            paymentStatus: 'Payment Status',
            paymentMethod: 'Payment Method',
            totalAmount: 'Total Amount',
            invoiceFooter: 'Thank you for your business',
            contactInfo: 'For any questions, please contact us',
            customerService: 'Customer Service'
          },
          status: {
            completed: 'Completed',
            pending: 'Pending'
          }
        }
      });
    } catch (error) {
      console.error('Error generating test payment PDF:', error);
      alert('Error generating PDF: ' + error);
    } finally {
      setIsGenerating(false);
    }
  };

  const testBillPDF = async () => {
    setIsGenerating(true);
    try {
      const testBillDetails = {
        invoiceNumber: 'BILL-001',
        status: 'PENDING',
        title: 'Test Bill',
        description: 'This is a test bill for demonstration purposes',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
        billType: 'MAINTENANCE',
        amount: '250.00',
        currency: 'IQD',
        propertyName: 'Test Property',
        assignedToName: 'John Doe'
      };

      await generateBillPDF(testBillDetails, {
        bills: {
          detail: {
            invoice: 'Bill',
            companyInfo: 'Company Information',
            taxOffice: 'Tax Office',
            taxNumber: 'Tax Number',
            dueDate: 'Due Date',
            billType: 'Bill Type',
            documentNumber: 'Document Number',
            billStatus: 'Bill Status',
            property: 'Property',
            assignedTo: 'Assigned To',
            totalAmount: 'Total Amount',
            invoiceFooter: 'Please pay this bill by the due date',
            contactInfo: 'For any questions, please contact us',
            customerService: 'Customer Service'
          },
          status: {
            paid: 'Paid',
            pending: 'Pending'
          }
        }
      });
    } catch (error) {
      console.error('Error generating test bill PDF:', error);
      alert('Error generating PDF: ' + error);
    } finally {
      setIsGenerating(false);
    }
  };

  const testPaymentPrint = async () => {
    try {
      const testPaymentDetails = {
        invoiceNumber: 'TEST-001',
        status: 'COMPLETED',
        description: 'Test Payment',
        notes: 'This is a test payment for demonstration purposes',
        date: new Date().toLocaleDateString('tr-TR'),
        transactionId: 'TXN-123456',
        receiptNumber: 'RCPT-789',
        paymentMethod: 'CREDIT_CARD',
        amount: '150.00',
        currency: 'IQD'
      };

      await generatePaymentPDFForPrint(testPaymentDetails, {
        payments: {
          detail: {
            invoice: 'Invoice',
            companyInfo: 'Company Information',
            taxOffice: 'Tax Office',
            taxNumber: 'Tax Number',
            invoiceDate: 'Invoice Date',
            transactionId: 'Transaction ID',
            receiptNumber: 'Receipt Number',
            paymentStatus: 'Payment Status',
            paymentMethod: 'Payment Method',
            totalAmount: 'Total Amount',
            invoiceFooter: 'Thank you for your business',
            contactInfo: 'For any questions, please contact us',
            customerService: 'Customer Service'
          },
          status: {
            completed: 'Completed',
            pending: 'Pending'
          }
        }
      });
    } catch (error) {
      console.error('Error generating test payment print:', error);
      alert('Error generating print: ' + error);
    }
  };

  const testBillPrint = async () => {
    try {
      const testBillDetails = {
        invoiceNumber: 'BILL-001',
        status: 'PENDING',
        title: 'Test Bill',
        description: 'This is a test bill for demonstration purposes',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
        billType: 'MAINTENANCE',
        amount: '250.00',
        currency: 'IQD',
        propertyName: 'Test Property',
        assignedToName: 'John Doe'
      };

      await generateBillPDFForPrint(testBillDetails, {
        bills: {
          detail: {
            invoice: 'Bill',
            companyInfo: 'Company Information',
            taxOffice: 'Tax Office',
            taxNumber: 'Tax Number',
            dueDate: 'Due Date',
            billType: 'Bill Type',
            documentNumber: 'Document Number',
            billStatus: 'Bill Status',
            property: 'Property',
            assignedTo: 'Assigned To',
            totalAmount: 'Total Amount',
            invoiceFooter: 'Please pay this bill by the due date',
            contactInfo: 'For any questions, please contact us',
            customerService: 'Customer Service'
          },
          status: {
            paid: 'Paid',
            pending: 'Pending'
          }
        }
      });
    } catch (error) {
      console.error('Error generating test bill print:', error);
      alert('Error generating print: ' + error);
    }
  };

  const testHTMLPaymentPDF = async () => {
    try {
      const testPaymentDetails = {
        invoiceNumber: 'TEST-001',
        status: 'COMPLETED',
        description: 'Test Payment',
        notes: 'This is a test payment for demonstration purposes',
        date: new Date().toLocaleDateString('tr-TR'),
        transactionId: 'TXN-123456',
        receiptNumber: 'RCPT-789',
        paymentMethod: 'CREDIT_CARD',
        amount: '150.00',
        currency: 'IQD'
      };

      await generateHTMLReceiptPDF(testPaymentDetails, {
        payments: {
          detail: {
            invoice: 'Invoice',
            invoiceDate: 'Invoice Date',
            transactionId: 'Transaction ID',
            receiptNumber: 'Receipt Number',
            paymentStatus: 'Payment Status',
            paymentMethod: 'Payment Method',
            totalAmount: 'Total Amount',
            invoiceFooter: 'Thank you for your business!',
            contactInfo: 'For any questions, please contact us',
            customerService: 'Customer Service',
            companyInfo: 'Company Information',
            taxOffice: 'Tax Office',
            taxNumber: 'Tax Number'
          },
          status: {
            completed: 'Completed',
            pending: 'Pending'
          }
        }
      }, { download: true });
    } catch (error) {
      console.error('Error generating HTML payment PDF:', error);
      alert('Error generating HTML payment PDF');
    }
  };

  const testHTMLPaymentPrint = async () => {
    try {
      const testPaymentDetails = {
        invoiceNumber: 'TEST-001',
        status: 'COMPLETED',
        description: 'Test Payment',
        notes: 'This is a test payment for demonstration purposes',
        date: new Date().toLocaleDateString('tr-TR'),
        transactionId: 'TXN-123456',
        receiptNumber: 'RCPT-789',
        paymentMethod: 'CREDIT_CARD',
        amount: '150.00',
        currency: 'IQD'
      };

      await generateHTMLReceiptPDF(testPaymentDetails, {
        payments: {
          detail: {
            invoice: 'Invoice',
            invoiceDate: 'Invoice Date',
            transactionId: 'Transaction ID',
            receiptNumber: 'Receipt Number',
            paymentStatus: 'Payment Status',
            paymentMethod: 'Payment Method',
            totalAmount: 'Total Amount',
            invoiceFooter: 'Thank you for your business!',
            contactInfo: 'For any questions, please contact us',
            customerService: 'Customer Service',
            companyInfo: 'Company Information',
            taxOffice: 'Tax Office',
            taxNumber: 'Tax Number'
          },
          status: {
            completed: 'Completed',
            pending: 'Pending'
          }
        }
      }, { print: true });
    } catch (error) {
      console.error('Error generating HTML payment print:', error);
      alert('Error generating HTML payment print');
    }
  };

  const testHTMLBillPDF = async () => {
    try {
      const testBillDetails = {
        invoiceNumber: 'BILL-001',
        status: 'PENDING',
        title: 'Test Bill',
        description: 'This is a test bill for demonstration purposes',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
        billType: 'MAINTENANCE',
        amount: '250.00',
        currency: 'IQD',
        propertyName: 'Test Property',
        assignedToName: 'John Doe'
      };

      await generateHTMLBillPDF(testBillDetails, {
        bills: {
          detail: {
            invoice: 'Bill',
            dueDate: 'Due Date',
            billType: 'Bill Type',
            documentNumber: 'Document Number',
            billStatus: 'Bill Status',
            property: 'Property',
            assignedTo: 'Assigned To',
            totalAmount: 'Total Amount',
            invoiceFooter: 'Thank you for your business!',
            contactInfo: 'For any questions, please contact us',
            customerService: 'Customer Service',
            companyInfo: 'Company Information',
            taxOffice: 'Tax Office',
            taxNumber: 'Tax Number'
          },
          status: {
            paid: 'Paid',
            pending: 'Pending'
          }
        }
      }, { download: true });
    } catch (error) {
      console.error('Error generating HTML bill PDF:', error);
      alert('Error generating HTML bill PDF');
    }
  };

  const testHTMLBillPrint = async () => {
    try {
      const testBillDetails = {
        invoiceNumber: 'BILL-001',
        status: 'PENDING',
        title: 'Test Bill',
        description: 'This is a test bill for demonstration purposes',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
        billType: 'MAINTENANCE',
        amount: '250.00',
        currency: 'IQD',
        propertyName: 'Test Property',
        assignedToName: 'John Doe'
      };

      await generateHTMLBillPDF(testBillDetails, {
        bills: {
          detail: {
            invoice: 'Bill',
            dueDate: 'Due Date',
            billType: 'Bill Type',
            documentNumber: 'Document Number',
            billStatus: 'Bill Status',
            property: 'Property',
            assignedTo: 'Assigned To',
            totalAmount: 'Total Amount',
            invoiceFooter: 'Thank you for your business!',
            contactInfo: 'For any questions, please contact us',
            customerService: 'Customer Service',
            companyInfo: 'Company Information',
            taxOffice: 'Tax Office',
            taxNumber: 'Tax Number'
          },
          status: {
            paid: 'Paid',
            pending: 'Pending'
          }
        }
      }, { print: true });
    } catch (error) {
      console.error('Error generating HTML bill print:', error);
      alert('Error generating HTML bill print');
    }
  };

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-on-light dark:text-on-dark mb-8">
          PDF Generation Test Page
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background-light-card dark:bg-background-card p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-on-light dark:text-on-dark mb-4">
              Test Payment PDF (Basic jsPDF)
            </h2>
            <p className="text-text-light-secondary dark:text-text-secondary mb-4">
              Generate a test payment receipt PDF to verify the functionality.
            </p>
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                icon={Download}
                onClick={testPaymentPDF}
                disabled={isGenerating}
                isLoading={isGenerating}
                className="w-full"
              >
                Generate Payment PDF
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={testPaymentPrint}
                className="w-full"
              >
                Test Payment Print
              </Button>
            </div>
          </div>

          <div className="bg-background-light-card dark:bg-background-card p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-on-light dark:text-on-dark mb-4">
              Test Bill PDF (Basic jsPDF)
            </h2>
            <p className="text-text-light-secondary dark:text-text-secondary mb-4">
              Generate a test bill PDF to verify the functionality.
            </p>
            <div className="space-y-3">
              <Button
                variant="secondary"
                size="lg"
                icon={Download}
                onClick={testBillPDF}
                disabled={isGenerating}
                isLoading={isGenerating}
                className="w-full"
              >
                Generate Bill PDF
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={testBillPrint}
                className="w-full"
              >
                Test Bill Print
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-on-light dark:text-on-dark mb-6 text-center">
            HTML Template PDFs (Professional Design)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background-light-card dark:bg-background-card p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-on-light dark:text-on-dark mb-4">
                Payment Receipts (HTML)
              </h3>
              <p className="text-text-light-secondary dark:text-text-secondary mb-4">
                Generate professional HTML-based payment receipts.
              </p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  icon={Download}
                  onClick={testHTMLPaymentPDF}
                  disabled={isGenerating}
                  className="w-full"
                >
                  📄 Generate HTML Payment PDF
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={testHTMLPaymentPrint}
                  className="w-full"
                >
                  🖨️ Print HTML Payment Receipt
                </Button>
              </div>
            </div>

            <div className="bg-background-light-card dark:bg-background-card p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-on-light dark:text-on-dark mb-4">
                Bill Invoices (HTML)
              </h3>
              <p className="text-text-light-secondary dark:text-text-secondary mb-4">
                Generate professional HTML-based bill invoices.
              </p>
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={Download}
                  onClick={testHTMLBillPDF}
                  disabled={isGenerating}
                  className="w-full"
                >
                  📄 Generate HTML Bill PDF
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={testHTMLBillPrint}
                  className="w-full"
                >
                  🖨️ Print HTML Bill Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-background-light-soft dark:bg-background-soft p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-on-light dark:text-on-dark mb-3">
            Instructions
          </h3>
          <ul className="text-text-light-secondary dark:text-text-secondary space-y-2">
            <li>• Click either button to generate a test PDF</li>
            <li>• The PDF will be automatically downloaded to your device</li>
            <li>• Check the browser console for any error messages</li>
            <li>• Verify that the PDF contains the correct information and styling</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
