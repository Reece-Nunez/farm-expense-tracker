import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import Button from '../ui/button';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listInvoices } from '../../graphql/invoiceQueries';
import { deleteInvoice } from '../../graphql/invoiceMutations';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const InvoiceList = ({ onEdit, onView, onCreate, onGeneratePDF }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      
      // Use real GraphQL queries
      const client = generateClient();
      const user = await getCurrentUser();
      
      // Query all invoices first, then filter client-side to avoid DynamoDB filter syntax issues
      const result = await client.graphql({
        query: listInvoices
      });
      
      // Filter on client side for the current user
      const userInvoices = result.data.listInvoices.items.filter(
        invoice => invoice.sub === user.sub
      );
      
      setInvoices(userInvoices);
      console.log(`Loaded ${userInvoices.length} invoices from database`);
      
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        // Use real GraphQL mutation
        const client = generateClient();
        await client.graphql({
          query: deleteInvoice,
          variables: { input: { id: invoiceId } }
        });
        
        // Update local state after successful deletion
        setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
        toast.success('Invoice deleted successfully');
        
      } catch (error) {
        console.error('Error deleting invoice:', error);
        toast.error('Failed to delete invoice');
      }
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

  const filteredAndSortedInvoices = invoices
    .filter(invoice => {
      if (filter !== 'all' && invoice.status !== filter) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
          invoice.customer?.name?.toLowerCase().includes(searchLower) ||
          invoice.notes?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'invoiceNumber':
          aVal = a.invoiceNumber;
          bVal = b.invoiceNumber;
          break;
        case 'customer':
          aVal = a.customer?.name || '';
          bVal = b.customer?.name || '';
          break;
        case 'total':
          aVal = a.total;
          bVal = b.total;
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          aVal = new Date(a.date);
          bVal = new Date(b.date);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const totalAmount = filteredAndSortedInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidAmount = filteredAndSortedInvoices
    .filter(invoice => invoice.status === 'PAID')
    .reduce((sum, invoice) => sum + invoice.total, 0);
  const unpaidAmount = totalAmount - paidAmount;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your invoices and billing
          </p>
        </div>
        <Button variant="primary" onClick={onCreate}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Paid</p>
              <p className="text-2xl font-bold text-green-600">
                ${paidAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Unpaid</p>
              <p className="text-2xl font-bold text-red-600">
                ${unpaidAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search invoices..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Filter</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="SENT">Sent</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="date">Date</option>
              <option value="invoiceNumber">Invoice #</option>
              <option value="customer">Customer</option>
              <option value="total">Amount</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Invoice List */}
      <div className="space-y-4">
        {filteredAndSortedInvoices.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No invoices found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Create your first invoice to get started'
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <Button variant="primary" onClick={onCreate}>
                Create Invoice
              </Button>
            )}
          </Card>
        ) : (
          filteredAndSortedInvoices.map((invoice) => (
            <Card key={invoice.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {invoice.invoiceNumber}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Customer: </span>
                      {invoice.customer?.name || 'Unknown Customer'}
                    </div>
                    <div>
                      <span className="font-medium">Date: </span>
                      {format(new Date(invoice.date), 'MMM dd, yyyy')}
                    </div>
                    <div>
                      <span className="font-medium">Due: </span>
                      {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM dd, yyyy') : 'No due date'}
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${invoice.total.toLocaleString()}
                  </div>

                  {invoice.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {invoice.notes}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView?.(invoice)}
                  >
                    View
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onEdit?.(invoice)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => onGeneratePDF?.(invoice)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(invoice.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={loadInvoices}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default InvoiceList;