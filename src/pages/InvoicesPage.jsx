import React, { useState, useEffect } from 'react';
import InvoiceList from '../components/invoices/InvoiceList';
import InvoiceForm from '../components/invoices/InvoiceForm';
import InvoiceView from '../components/invoices/InvoiceView';
import InvoicePDFPreview from '../components/invoices/InvoicePDFPreview';
import { getCurrentUser } from '../utils/getCurrentUser';
import toast from 'react-hot-toast';

const InvoicesPage = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [farmInfo, setFarmInfo] = useState({});

  useEffect(() => {
    loadFarmInfo();
  }, []);

  const loadFarmInfo = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setFarmInfo({
          farmName: user.farmName || 'HarvesTrackr Farm',
          address: user.address || '',
          city: user.city || '',
          state: user.state || '',
          zipCode: user.zipCode || '',
          country: user.country || 'United States',
          phone: user.phone || '',
          email: user.email || '',
          website: user.website || ''
        });
      }
    } catch (error) {
      console.error('Error loading farm info:', error);
    }
  };

  const handleCreateInvoice = () => {
    setSelectedInvoice(null);
    setCurrentView('form');
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('form');
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('view');
  };

  const handleSaveInvoice = (invoice) => {
    setCurrentView('list');
    setSelectedInvoice(null);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedInvoice(null);
  };

  const handleGeneratePDF = async (invoice) => {
    try {
      if (!invoice) {
        toast.error('No invoice selected for PDF generation');
        return;
      }

      setSelectedInvoice(invoice);
      setShowPDFPreview(true);
      toast.success('Opening PDF preview...');
    } catch (error) {
      console.error('Error preparing PDF generation:', error);
      toast.error('Failed to prepare PDF generation');
    }
  };

  const handleClosePDFPreview = () => {
    setShowPDFPreview(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {currentView === 'list' && (
          <InvoiceList
            onCreate={handleCreateInvoice}
            onEdit={handleEditInvoice}
            onView={handleViewInvoice}
            onGeneratePDF={handleGeneratePDF}
          />
        )}

        {currentView === 'form' && (
          <InvoiceForm
            invoice={selectedInvoice}
            onSave={handleSaveInvoice}
            onCancel={handleCancel}
          />
        )}

        {currentView === 'view' && selectedInvoice && (
          <InvoiceView
            invoiceId={selectedInvoice.id}
            onEdit={handleEditInvoice}
            onClose={handleCancel}
            onGeneratePDF={handleGeneratePDF}
          />
        )}

        {/* PDF Preview Modal */}
        {showPDFPreview && selectedInvoice && (
          <InvoicePDFPreview
            invoice={selectedInvoice}
            farmInfo={farmInfo}
            onClose={handleClosePDFPreview}
          />
        )}
      </div>
    </div>
  );
};

export default InvoicesPage;