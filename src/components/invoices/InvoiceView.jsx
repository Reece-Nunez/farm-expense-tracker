import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { generateClient } from 'aws-amplify/api';
import { getInvoice } from '../../graphql/invoiceQueries';
import { updateInvoice } from '../../graphql/invoiceMutations';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const InvoiceView = ({ invoiceId, onEdit, onClose, onGeneratePDF }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (invoiceId) {
      loadInvoice();
    }
  }, [invoiceId]);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      const client = generateClient();
      const result = await client.graphql({
        query: getInvoice,
        variables: { id: invoiceId }
      });
      setInvoice(result.data.getInvoice);
    } catch (error) {
      console.error('Error loading invoice:', error);
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const client = generateClient();
      const updatedInvoice = await client.graphql({
        query: updateInvoice,
        variables: {
          input: {
            id: invoice.id,
            status: newStatus,
            ...(newStatus === 'PAID' && { paidDate: new Date().toISOString().split('T')[0] })
          }
        }
      });
      setInvoice(updatedInvoice.data.updateInvoice);
      toast.success(`Invoice marked as ${newStatus.toLowerCase()}`);
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Failed to update invoice status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'SENT':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const isOverdue = () => {
    if (!invoice?.dueDate || invoice.status === 'PAID' || invoice.status === 'CANCELLED') {
      return false;
    }
    return new Date(invoice.dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <Card className="p-12 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold mb-2">Invoice not found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The invoice you're looking for doesn't exist or has been deleted.
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
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {invoice.invoiceNumber}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </span>
            {isOverdue() && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                OVERDUE
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Invoice details and line items
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => onEdit?.(invoice)}>
            Edit
          </Button>
          <Button variant="success" onClick={() => onGeneratePDF?.(invoice)}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </Button>
        </div>
      </div>

      {/* Status Actions */}
      {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && (
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">
              Quick Actions:
            </span>
            {invoice.status === 'DRAFT' && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => updateStatus('SENT')}
                loading={updating}
              >
                Mark as Sent
              </Button>
            )}
            {(invoice.status === 'SENT' || invoice.status === 'OVERDUE') && (
              <Button
                size="sm"
                variant="success"
                onClick={() => updateStatus('PAID')}
                loading={updating}
              >
                Mark as Paid
              </Button>
            )}
            <Button
              size="sm"
              variant="danger"
              onClick={() => updateStatus('CANCELLED')}
              loading={updating}
            >
              Cancel Invoice
            </Button>
          </div>
        </Card>
      )}

      {/* Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Bill To</h3>
          {invoice.customer ? (
            <div className="space-y-2">
              <p className="font-medium text-gray-900 dark:text-white">
                {invoice.customer.name}
              </p>
              {invoice.customer.email && (
                <p className="text-gray-600 dark:text-gray-400">
                  {invoice.customer.email}
                </p>
              )}
              {invoice.customer.phone && (
                <p className="text-gray-600 dark:text-gray-400">
                  {invoice.customer.phone}
                </p>
              )}
              {invoice.customer.address && (
                <div className="text-gray-600 dark:text-gray-400">
                  <p>{invoice.customer.address}</p>
                  <p>
                    {[
                      invoice.customer.city,
                      invoice.customer.state,
                      invoice.customer.zipCode
                    ].filter(Boolean).join(', ')}
                  </p>
                  {invoice.customer.country && <p>{invoice.customer.country}</p>}
                </div>
              )}
              {invoice.customer.taxNumber && (
                <p className="text-gray-600 dark:text-gray-400">
                  Tax ID: {invoice.customer.taxNumber}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic">Customer information unavailable</p>
          )}
        </Card>

        {/* Invoice Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Invoice Number:</span>
              <span className="font-medium">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Invoice Date:</span>
              <span className="font-medium">
                {format(new Date(invoice.date), 'MMMM dd, yyyy')}
              </span>
            </div>
            {invoice.dueDate && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
                <span className={`font-medium ${isOverdue() ? 'text-red-600' : ''}`}>
                  {format(new Date(invoice.dueDate), 'MMMM dd, yyyy')}
                </span>
              </div>
            )}
            {invoice.paidDate && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Paid Date:</span>
                <span className="font-medium text-green-600">
                  {format(new Date(invoice.paidDate), 'MMMM dd, yyyy')}
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Line Items */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Line Items</h3>
        
        {invoice.items?.items && invoice.items.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2">Description</th>
                  <th className="text-center py-3 px-2 w-20">Qty</th>
                  <th className="text-right py-3 px-2 w-24">Unit Price</th>
                  <th className="text-center py-3 px-2 w-20">Unit</th>
                  <th className="text-right py-3 px-2 w-24">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.items.map((item, index) => (
                  <tr key={item.id || index} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        {item.category && (
                          <p className="text-sm text-gray-500">{item.category}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-2 text-right">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {item.unit || 'each'}
                    </td>
                    <td className="py-3 px-2 text-right font-medium">
                      ${item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic text-center py-8">
            No line items found for this invoice
          </p>
        )}
      </Card>

      {/* Totals */}
      <Card className="p-6">
        <div className="max-w-md ml-auto space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
          </div>
          
          {invoice.taxRate > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Tax ({invoice.taxRate}%):
              </span>
              <span className="font-medium">${invoice.taxAmount.toFixed(2)}</span>
            </div>
          )}
          
          {invoice.discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Discount:</span>
              <span className="font-medium text-green-600">
                -${invoice.discountAmount.toFixed(2)}
              </span>
            </div>
          )}
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Notes and Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {invoice.notes && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Notes</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {invoice.notes}
            </p>
          </Card>
        )}

        {invoice.terms && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Terms & Conditions</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {invoice.terms}
            </p>
          </Card>
        )}
      </div>

      {/* Timestamps */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-3">Record Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-medium">Created:</span>{' '}
            {invoice.createdAt ? format(new Date(invoice.createdAt), 'MMMM dd, yyyy HH:mm') : 'Unknown'}
          </div>
          <div>
            <span className="font-medium">Last Updated:</span>{' '}
            {invoice.updatedAt ? format(new Date(invoice.updatedAt), 'MMMM dd, yyyy HH:mm') : 'Unknown'}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceView;