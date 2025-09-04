import React, { useState } from 'react';
import CustomerList from '../components/customers/CustomerList';
import CustomerForm from '../components/customers/CustomerForm';
import CustomerView from '../components/customers/CustomerView';

const CustomersPage = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setCurrentView('form');
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCurrentView('form');
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCurrentView('view');
  };

  const handleSaveCustomer = (customer) => {
    setCurrentView('list');
    setSelectedCustomer(null);
    // You could add a callback here to refresh the customer list
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedCustomer(null);
  };

  const handleCreateInvoiceForCustomer = (customer) => {
    // This would navigate to create invoice with pre-selected customer
    // For now, we'll just show a message
    console.log('Create invoice for customer:', customer.name);
    // In a real implementation, you might:
    // navigate('/dashboard/invoices/create', { state: { customer } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {currentView === 'list' && (
          <CustomerList
            onCreate={handleCreateCustomer}
            onEdit={handleEditCustomer}
            onView={handleViewCustomer}
          />
        )}

        {currentView === 'form' && (
          <CustomerForm
            customer={selectedCustomer}
            onSave={handleSaveCustomer}
            onCancel={handleCancel}
          />
        )}

        {currentView === 'view' && selectedCustomer && (
          <CustomerView
            customerId={selectedCustomer.id}
            onEdit={handleEditCustomer}
            onClose={handleCancel}
            onCreate={handleCreateInvoiceForCustomer}
          />
        )}
      </div>
    </div>
  );
};

export default CustomersPage;