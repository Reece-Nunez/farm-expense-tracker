import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { generateClient } from 'aws-amplify/api';
import { getCustomer } from '../../graphql/invoiceQueries';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const CustomerView = ({ customerId, onEdit, onClose, onCreate }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerId) {
      loadCustomer();
    }
  }, [customerId]);

  const loadCustomer = async () => {
    try {
      setLoading(true);
      const client = generateClient();
      const result = await client.graphql({
        query: getCustomer,
        variables: { id: customerId }
      });
      setCustomer(result.data.getCustomer);
    } catch (error) {
      console.error('Error loading customer:', error);
      toast.error('Failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = () => {
    onCreate?.(customer);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <Card className="p-12 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold mb-2">Customer not found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The customer you're looking for doesn't exist or has been deleted.
        </p>
        <Button variant="primary" onClick={onClose}>
          Go Back
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {customer.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customer details and invoice history
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => onEdit?.(customer)}>
            Edit Customer
          </Button>
          <Button variant="success" onClick={handleCreateInvoice}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Contact Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{customer.name}</p>
            </div>

            {customer.email && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <a 
                    href={`mailto:${customer.email}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    {customer.email}
                  </a>
                </div>
              </div>
            )}

            {customer.phone && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
                <div className="flex items-center gap-2 mt-1">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a 
                    href={`tel:${customer.phone}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    {customer.phone}
                  </a>
                </div>
              </div>
            )}

            {customer.taxNumber && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Tax ID</label>
                <p className="text-gray-900 dark:text-white font-mono">{customer.taxNumber}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Address Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Address Information
          </h3>

          {(customer.address || customer.city || customer.state || customer.zipCode || customer.country) ? (
            <div className="space-y-2">
              {customer.address && (
                <p className="text-gray-900 dark:text-white">{customer.address}</p>
              )}
              {(customer.city || customer.state || customer.zipCode) && (
                <p className="text-gray-900 dark:text-white">
                  {[customer.city, customer.state, customer.zipCode].filter(Boolean).join(', ')}
                </p>
              )}
              {customer.country && (
                <p className="text-gray-900 dark:text-white">{customer.country}</p>
              )}
              
              {/* Google Maps Link */}
              {(customer.address || customer.city) && (
                <div className="pt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      [customer.address, customer.city, customer.state, customer.zipCode, customer.country]
                        .filter(Boolean)
                        .join(', ')
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 italic">
              No address information provided
            </div>
          )}
        </Card>
      </div>

      {/* Notes */}
      {customer.notes && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Notes
          </h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {customer.notes}
          </p>
        </Card>
      )}

      {/* Invoice History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Invoice History
        </h3>

        {customer.invoices?.items && customer.invoices.items.length > 0 ? (
          <div className="space-y-3">
            {customer.invoices.items
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((invoice) => (
                <div 
                  key={invoice.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {invoice.invoiceNumber}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'PAID' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : invoice.status === 'SENT'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : invoice.status === 'OVERDUE'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {format(new Date(invoice.date), 'MMM dd, yyyy')} • ${invoice.total.toFixed(2)}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Invoice
                  </Button>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No invoices yet for this customer
            </p>
            <Button variant="primary" onClick={handleCreateInvoice}>
              Create First Invoice
            </Button>
          </div>
        )}
      </Card>

      {/* Record Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-3">Record Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-medium">Customer Added:</span>{' '}
            {format(new Date(customer.createdAt), 'MMMM dd, yyyy HH:mm')}
          </div>
          <div>
            <span className="font-medium">Last Updated:</span>{' '}
            {format(new Date(customer.updatedAt), 'MMMM dd, yyyy HH:mm')}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomerView;