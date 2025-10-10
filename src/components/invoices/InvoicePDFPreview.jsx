import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { generateInvoicePDF } from '../../utils/pdfService';
import toast from 'react-hot-toast';

const InvoicePDFPreview = ({ invoice, farmInfo, onClose }) => {
  const [pdfDataUri, setPdfDataUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfGenerator, setPdfGenerator] = useState(null);

  useEffect(() => {
    generatePreview();
  }, [invoice]);

  const generatePreview = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const pdfResult = await generateInvoicePDF(invoice, farmInfo);
      setPdfGenerator(pdfResult);
      
      // Generate preview
      const dataUri = pdfResult.getDataUri();
      setPdfDataUri(dataUri);
    } catch (err) {
      console.error('Error generating PDF preview:', err);
      setError(err.message);
      toast.error('Failed to generate PDF preview');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (pdfGenerator) {
        pdfGenerator.download();
        toast.success('Invoice PDF downloaded successfully');
      }
    } catch (err) {
      console.error('Error downloading PDF:', err);
      toast.error('Failed to download PDF');
    }
  };

  const handlePrint = async () => {
    try {
      if (pdfDataUri) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice ${invoice.invoiceNumber}</title>
              <style>
                body { margin: 0; }
                embed { width: 100vw; height: 100vh; }
              </style>
            </head>
            <body>
              <embed src="${pdfDataUri}" type="application/pdf" />
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 1000);
      }
    } catch (err) {
      console.error('Error printing PDF:', err);
      toast.error('Failed to open print preview');
    }
  };

  const handleEmail = async () => {
    try {
      if (pdfGenerator && invoice.customer?.email) {
        // Create mailto link with PDF attachment simulation
        const subject = `Invoice ${invoice.invoiceNumber} from ${farmInfo.farmName || 'HarvesTrackr Farm'}`;
        const body = `Dear ${invoice.customer.name},

Please find attached invoice ${invoice.invoiceNumber} for $${invoice.total.toFixed(2)}.

Thank you for your business!

Best regards,
${farmInfo.farmName || 'HarvesTrackr Farm'}`;

        const mailtoUrl = `mailto:${invoice.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoUrl);
        
        toast.success('Email client opened. Please attach the downloaded PDF manually.');
      } else {
        toast.error('Customer email not available');
      }
    } catch (err) {
      console.error('Error preparing email:', err);
      toast.error('Failed to prepare email');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Generating PDF Preview</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Creating your invoice PDF...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-lg font-semibold mb-2">PDF Generation Failed</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={generatePreview}>
                Try Again
              </Button>
              <Button variant="primary" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Invoice PDF Preview
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {invoice.invoiceNumber} • {invoice.customer?.name}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {invoice.customer?.email && (
              <Button variant="outline" size="sm" onClick={handleEmail}>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </Button>
            )}
            
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </Button>
            
            <Button variant="primary" size="sm" onClick={handleDownload}>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </Button>
            
            <Button variant="outline" size="sm" onClick={onClose}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>

        {/* PDF Preview */}
        <div className="flex-1 p-4 overflow-hidden">
          {pdfDataUri ? (
            <embed
              src={pdfDataUri}
              type="application/pdf"
              width="100%"
              height="100%"
              className="rounded-lg border border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-4">📄</div>
                <p className="text-gray-600 dark:text-gray-400">
                  PDF preview not available
                </p>
                <Button variant="outline" onClick={handleDownload} className="mt-4">
                  Download PDF Instead
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div>
              Invoice Total: <span className="font-semibold text-green-600">${invoice.total?.toFixed(2)}</span>
            </div>
            <div>
              Status: <span className={`font-semibold ${
                invoice.status === 'PAID' ? 'text-green-600' :
                invoice.status === 'SENT' ? 'text-blue-600' :
                invoice.status === 'OVERDUE' ? 'text-red-600' :
                'text-yellow-600'
              }`}>{invoice.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDFPreview;