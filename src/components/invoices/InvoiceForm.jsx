import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import Button from '../ui/button';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { createInvoice, updateInvoice, createInvoiceItem, updateInvoiceItem, deleteInvoiceItem } from '../../graphql/invoiceMutations';
import { listCustomers, listProducts } from '../../graphql/invoiceQueries';
import toast from 'react-hot-toast';

const InvoiceForm = ({ invoice = null, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    customerID: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'DRAFT',
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 0,
    notes: '',
    terms: 'Payment due within 30 days'
  });
  const [items, setItems] = useState([
    { description: '', quantity: 1, unitPrice: 0, total: 0, category: '', unit: 'each' }
  ]);

  useEffect(() => {
    loadCustomers();
    loadProducts();
    if (invoice) {
      setFormData({
        customerID: invoice.customerID,
        invoiceNumber: invoice.invoiceNumber,
        date: invoice.date,
        dueDate: invoice.dueDate || '',
        status: invoice.status,
        subtotal: invoice.subtotal,
        taxRate: invoice.taxRate || 0,
        taxAmount: invoice.taxAmount || 0,
        discountAmount: invoice.discountAmount || 0,
        total: invoice.total,
        notes: invoice.notes || '',
        terms: invoice.terms || 'Payment due within 30 days'
      });
      if (invoice.items?.items) {
        setItems(invoice.items.items.map(item => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
          category: item.category || '',
          unit: item.unit || 'each'
        })));
      }
    } else {
      generateInvoiceNumber();
    }
  }, [invoice]);

  useEffect(() => {
    calculateTotals();
  }, [items, formData.taxRate, formData.discountAmount]);

  const loadCustomers = async () => {
    try {
      const client = generateClient();
      const user = await getCurrentUser();
      const result = await client.graphql({
        query: listCustomers,
        variables: {
          filter: { sub: { eq: user.sub } }
        }
      });
      setCustomers(result.data.listCustomers.items);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const client = generateClient();
      const user = await getCurrentUser();
      const result = await client.graphql({
        query: listProducts,
        variables: {
          filter: { sub: { eq: user.sub } }
        }
      });
      setProducts(result.data.listProducts.items);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setFormData(prev => ({
      ...prev,
      invoiceNumber: `INV-${year}${month}${day}-${random}`
    }));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * (formData.taxRate / 100);
    const total = subtotal + taxAmount - formData.discountAmount;

    setFormData(prev => ({
      ...prev,
      subtotal: subtotal,
      taxAmount: taxAmount,
      total: total
    }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, total: 0, category: '', unit: 'each' }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const selectProduct = (index, productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateItem(index, 'description', product.name);
      updateItem(index, 'unitPrice', product.unitPrice);
      updateItem(index, 'category', product.category);
      updateItem(index, 'unit', product.unit);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerID || items.some(item => !item.description)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const client = generateClient();
      const user = await getCurrentUser();
      
      const invoiceInput = {
        ...formData,
        sub: user.sub,
        subtotal: parseFloat(formData.subtotal.toFixed(2)),
        taxRate: parseFloat(formData.taxRate),
        taxAmount: parseFloat(formData.taxAmount.toFixed(2)),
        discountAmount: parseFloat(formData.discountAmount),
        total: parseFloat(formData.total.toFixed(2))
      };

      let savedInvoice;
      if (invoice) {
        const { id, ...updateData } = invoiceInput;
        savedInvoice = await client.graphql({
          query: updateInvoice,
          variables: { input: { id: invoice.id, ...updateData } }
        });
        savedInvoice = savedInvoice.data.updateInvoice;
      } else {
        savedInvoice = await client.graphql({
          query: createInvoice,
          variables: { input: invoiceInput }
        });
        savedInvoice = savedInvoice.data.createInvoice;
      }

      // Handle invoice items
      if (invoice?.items?.items) {
        // Delete removed items
        const existingItemIds = invoice.items.items.map(item => item.id);
        const newItemIds = items.filter(item => item.id).map(item => item.id);
        const itemsToDelete = existingItemIds.filter(id => !newItemIds.includes(id));
        
        for (const itemId of itemsToDelete) {
          await client.graphql({
            query: deleteInvoiceItem,
            variables: { input: { id: itemId } }
          });
        }
      }

      // Create or update items
      for (const item of items) {
        const itemInput = {
          invoiceID: savedInvoice.id,
          sub: user.sub,
          description: item.description,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          total: parseFloat(item.total),
          category: item.category,
          unit: item.unit
        };

        if (item.id) {
          await client.graphql({
            query: updateInvoiceItem,
            variables: { input: { id: item.id, ...itemInput } }
          });
        } else {
          await client.graphql({
            query: createInvoiceItem,
            variables: { input: itemInput }
          });
        }
      }

      toast.success(invoice ? 'Invoice updated successfully' : 'Invoice created successfully');
      onSave?.(savedInvoice);
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {invoice ? 'Edit Invoice' : 'Create New Invoice'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer *</label>
              <select
                value={formData.customerID}
                onChange={(e) => setFormData({ ...formData, customerID: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invoice Number</label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invoice Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Line Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                        {products.length > 0 && (
                          <select
                            onChange={(e) => selectProduct(index, e.target.value)}
                            className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="">Select Product</option>
                            {products.map(product => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit Price</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => updateItem(index, 'unit', e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="each, lb, kg, etc."
                      />
                    </div>

                    <div className="flex items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total</label>
                        <div className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-right">
                          ${item.total.toFixed(2)}
                        </div>
                      </div>
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="ml-2"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Totals */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount Amount</label>
                  <input
                    type="number"
                    value={formData.discountAmount}
                    onChange={(e) => setFormData({ ...formData, discountAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2 text-gray-900 dark:text-white">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${formData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({formData.taxRate}%):</span>
                  <span>${formData.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-${formData.discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white border-t pt-2">
                  <span>Total:</span>
                  <span>${formData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Notes and Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows="3"
                placeholder="Additional notes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Terms</label>
              <textarea
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows="3"
                placeholder="Payment terms..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1 md:flex-none"
            >
              {invoice ? 'Update Invoice' : 'Create Invoice'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 md:flex-none"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default InvoiceForm;