import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';

const MockOCRProcessor = ({ imageFile, imageUrl, onCreateExpense, onClose }) => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mockData, setMockData] = useState(null);

  // Process the receipt image on mount
  useEffect(() => {
    if (imageFile) {
      processMockReceipt();
    }
  }, [imageFile]);

  const processMockReceipt = async () => {
    if (!imageFile) return;

    setProcessing(true);
    setProgress(0);

    try {
      // Simulate OCR processing with progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Create mock receipt data
      const mockReceiptData = {
        vendor: 'Farm Supply Co',
        date: new Date().toISOString().split('T')[0],
        total: 89.99,
        subtotal: 83.32,
        tax: 6.67,
        items: [
          {
            description: 'Premium Fertilizer 50lb',
            quantity: 2,
            unitPrice: 25.99,
            total: 51.98,
            category: 'Fertilizers'
          },
          {
            description: 'Garden Tools Set',
            quantity: 1,
            unitPrice: 31.34,
            total: 31.34,
            category: 'Tools & Equipment'
          }
        ],
        confidence: 'high',
        notes: 'Mock receipt data - OCR simulation for testing'
      };

      setMockData(mockReceiptData);
      toast.success('Receipt processed successfully! (Mock data)');
    } catch (err) {
      console.error('Mock processing error:', err);
      toast.error('Failed to process receipt. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const createExpenseFromReceipt = async () => {
    if (!mockData) return;

    try {
      const expenseData = {
        vendor: mockData.vendor,
        date: mockData.date,
        grandTotal: mockData.total,
        notes: mockData.notes,
        receiptImage: imageUrl,
        lineItems: mockData.items.map((item) => ({
          item: item.description,
          category: item.category,
          quantity: item.quantity,
          unitCost: item.unitPrice,
          lineTotal: item.total
        }))
      };

      await onCreateExpense(expenseData);
      toast.success('Mock expense created from receipt!');
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
              Simulating OCR extraction (Mock Mode)
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

  if (!mockData) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <Card className="bg-white dark:bg-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                🧾 Receipt Analysis Results (Mock Mode)
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  MOCK DATA
                </span>
                <span className="text-sm text-gray-500">
                  Simulated OCR results for testing
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
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      OCR Service Issue
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        The OCR service is currently experiencing issues. This is mock data for testing purposes.
                        The actual OCR functionality will extract real text from receipt images.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Data */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">📝 Extracted Information (Mock)</h3>
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Vendor</label>
                  <input
                    type="text"
                    value={mockData.vendor}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={mockData.date}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              {/* Totals */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subtotal</label>
                  <input
                    type="text"
                    value={`$${mockData.subtotal}`}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Tax</label>
                  <input
                    type="text"
                    value={`$${mockData.tax}`}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Total</label>
                  <input
                    type="text"
                    value={`$${mockData.total}`}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-50 font-semibold text-green-600"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <label className="text-sm font-medium mb-3 block">Line Items (Mock)</label>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {mockData.items.map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <input
                          type="text"
                          value={item.description}
                          readOnly
                          className="w-full p-2 border rounded text-sm bg-white"
                        />
                        
                        <input
                          type="text"
                          value={item.category}
                          readOnly
                          className="w-full p-2 border rounded text-sm bg-white"
                        />
                        
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="w-full p-2 border rounded text-sm bg-white"
                        />
                        
                        <input
                          type="text"
                          value={`$${item.total}`}
                          readOnly
                          className="w-full p-2 border rounded text-sm bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              ⚠️ This is mock data while OCR service is being fixed
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={createExpenseFromReceipt}>
                ✅ Create Mock Expense
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MockOCRProcessor;