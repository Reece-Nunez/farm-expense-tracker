import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import Button from '../ui/button';
import { processReceiptImage } from '../../services/ocrService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ReceiptProcessor = ({ imageFile, imageUrl, onCreateExpense, onClose }) => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [receiptData, setReceiptData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [error, setError] = useState(null);

  // Process the receipt image on mount
  useEffect(() => {
    if (imageFile) {
      processReceipt();
    }
  }, [imageFile]);

  const processReceipt = async () => {
    if (!imageFile) return;

    setProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const data = await processReceiptImage(imageFile, (progressValue) => {
        setProgress(progressValue);
      });

      setReceiptData(data);
      setEditedData({
        vendor: data.vendor,
        date: data.date,
        total: data.total.toFixed(2),
        subtotal: data.subtotal.toFixed(2),
        tax: data.tax.toFixed(2),
        items: data.items.map(item => ({
          ...item,
          unitPrice: item.unitPrice.toFixed(2),
          total: item.total.toFixed(2)
        })),
        notes: `Receipt processed via OCR - Confidence: ${data.confidence}`
      });

      toast.success(`Receipt processed successfully! (${data.confidence} confidence)`);
    } catch (err) {
      console.error('Receipt processing error:', err);
      setError(err.message || 'Failed to process receipt');
      toast.error('Failed to process receipt. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    setEditedData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = () => {
    setEditedData(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        unitPrice: '0.00',
        total: '0.00',
        category: 'General Supplies'
      }]
    }));
  };

  const removeItem = (index) => {
    setEditedData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    if (!editedData) return;

    const itemsTotal = editedData.items.reduce((sum, item) => 
      sum + (parseFloat(item.total) || 0), 0
    );

    const tax = parseFloat(editedData.tax) || 0;
    const total = itemsTotal + tax;

    handleFieldChange('subtotal', itemsTotal.toFixed(2));
    handleFieldChange('total', total.toFixed(2));
  };

  const createExpenseFromReceipt = async () => {
    if (!editedData) return;

    try {
      const expenseData = {
        vendor: editedData.vendor || 'Unknown Vendor',
        date: editedData.date || new Date().toISOString().split('T')[0],
        grandTotal: parseFloat(editedData.total) || 0,
        notes: editedData.notes,
        receiptImage: imageUrl,
        lineItems: editedData.items.map((item, index) => ({
          item: item.description,
          category: item.category,
          quantity: parseFloat(item.quantity) || 1,
          unitCost: parseFloat(item.unitPrice) || 0,
          lineTotal: parseFloat(item.total) || 0
        }))
      };

      await onCreateExpense(expenseData);
      toast.success('Expense created from receipt!');
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error('Failed to create expense. Please try again.');
    }
  };

  if (processing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Processing Receipt...</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Extracting text and analyzing content
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{progress}%</p>
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
            <h3 className="text-lg font-semibold mb-2">Processing Failed</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setError(null)}>
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

  if (!receiptData || !editedData) {
    return null;
  }

  const confidenceColor = {
    high: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    low: 'text-red-600 bg-red-100'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <Card className="bg-white dark:bg-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                🧾 Receipt Analysis Results
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${confidenceColor[receiptData.confidence]}`}>
                  {receiptData.confidence.toUpperCase()} CONFIDENCE
                </span>
                <span className="text-sm text-gray-500">
                  Review and edit the extracted information
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Receipt Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📷 Original Receipt</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <img
                  src={imageUrl}
                  alt="Receipt"
                  className="w-full h-auto max-h-96 object-contain rounded-lg border"
                />
              </div>
              
              {/* Raw OCR Text */}
              <div>
                <h4 className="font-medium mb-2">Raw OCR Text:</h4>
                <textarea
                  value={receiptData.rawText}
                  readOnly
                  className="w-full h-32 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 text-sm font-mono resize-none"
                />
              </div>
            </div>

            {/* Extracted Data */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">📝 Extracted Information</h3>
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Vendor</label>
                  <input
                    type="text"
                    value={editedData.vendor}
                    onChange={(e) => handleFieldChange('vendor', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter vendor name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={editedData.date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Totals */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subtotal</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editedData.subtotal}
                    onChange={(e) => handleFieldChange('subtotal', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Tax</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editedData.tax}
                    onChange={(e) => handleFieldChange('tax', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Total</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editedData.total}
                    onChange={(e) => handleFieldChange('total', e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold text-green-600"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Line Items</label>
                  <Button variant="outline" size="sm" onClick={addItem}>
                    + Add Item
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {editedData.items.map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="w-full p-2 border rounded text-sm"
                        />
                        
                        <select
                          value={item.category}
                          onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                          className="w-full p-2 border rounded text-sm"
                        >
                          <option value="Seeds & Plants">Seeds & Plants</option>
                          <option value="Fertilizers">Fertilizers</option>
                          <option value="Pesticides">Pesticides</option>
                          <option value="Tools & Equipment">Tools & Equipment</option>
                          <option value="Feed & Nutrition">Feed & Nutrition</option>
                          <option value="Fuel & Energy">Fuel & Energy</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="General Supplies">General Supplies</option>
                        </select>
                        
                        <input
                          type="number"
                          placeholder="Qty"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full p-2 border rounded text-sm"
                        />
                        
                        <div className="flex gap-1">
                          <input
                            type="number"
                            placeholder="Total"
                            step="0.01"
                            value={item.total}
                            onChange={(e) => handleItemChange(index, 'total', e.target.value)}
                            className="flex-1 p-2 border rounded text-sm"
                          />
                          <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => removeItem(index)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3">
                  <Button variant="outline" size="sm" onClick={calculateTotals} fullWidth>
                    🧮 Recalculate Totals
                  </Button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={editedData.notes}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              💡 Review the extracted data and make any necessary corrections
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={createExpenseFromReceipt}>
                ✅ Create Expense
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReceiptProcessor;