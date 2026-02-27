import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReceiptScanner from '../components/receipts/ReceiptScanner';
import ReceiptProcessor from '../components/receipts/ReceiptProcessor';
import MockOCRProcessor from '../components/receipts/MockOCRProcessor';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from '../utils/getCurrentUser';
import { createExpense } from '../graphql/mutations';
import { createLineItem } from '../graphql/mutations';
import toast from 'react-hot-toast';

const ReceiptScanPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('scan'); // scan, process, complete
  const [receiptImage, setReceiptImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [processingError, setProcessingError] = useState(null);

  const handleReceiptCapture = (imageBlob, imageUrl) => {
    setReceiptImage(imageBlob);
    setImageUrl(imageUrl);
    setCurrentStep('process');
  };

  const handleReceiptProcess = async (imageFile, imageUrl) => {
    // This is called from ReceiptScanner after capture
    setReceiptImage(imageFile);
    setImageUrl(imageUrl);
    setCurrentStep('process');
  };

  const handleCreateExpense = async (expenseData) => {
    try {
      const client = generateClient();
      const user = await getCurrentUser();

      if (!user) {
        toast.error('Please log in to create expenses');
        return;
      }

      const expenseInput = {
        sub: user.sub,
        userId: user.id,
        vendor: expenseData.vendor,
        date: expenseData.date,
        grandTotal: expenseData.grandTotal,
        notes: expenseData.notes,
      };

      const expenseResult = await client.graphql({
        query: createExpense,
        variables: {
          input: expenseInput
        }
      });

      const createdExpense = expenseResult.data.createExpense;

      if
      if (expenseData.lineItems && expenseData.lineItems.length > 0) {
        for (const lineItem of expenseData.lineItems) {
          const lineItemInput = {
            ...lineItem,
            expenseID: createdExpense.id,
            sub: user.sub,
            userId: user.id,
          };

          await client.graphql({
            query: createLineItem,
            variables: {
              input: lineItemInput
            }
          });
        }
      }

      toast.success('Expense created successfully from receipt!');
      setCurrentStep('complete');

      // Navigate to expenses page after a short delay
      setTimeout(() => {
        navigate('/dashboard/expenses');
      }, 2000);

    } catch (error) {
      console.error('Error creating expense from receipt:', error);
      toast.error('Failed to create expense. Please try again.');
      setProcessingError(error.message);
    }
  };

  const handleClose = () => {
    // Clean up image URL to prevent memory leaks
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    navigate('/dashboard');
  };

  const handleRetry = () => {
    // Clean up current image
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setReceiptImage(null);
    setImageUrl(null);
    setProcessingError(null);
    setCurrentStep('scan');
  };

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="text-6xl mb-4 font-bold text-green-600">Done</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Expense Created!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your receipt has been successfully processed and converted to an expense record.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard/expenses')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                View Expenses
              </button>
              <button
                onClick={handleRetry}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Scan Another Receipt
              </button>
              <button
                onClick={handleClose}
                className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium py-2 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Receipt Scanner
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentStep === 'scan' ? 'Capture your receipt' : 'Review extracted data'}
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              currentStep === 'scan' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
            }`}>
              <span className="w-2 h-2 rounded-full bg-current"></span>
              Scan
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              currentStep === 'process' ? 'bg-blue-100 text-blue-700' : 
              currentStep === 'complete' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              <span className="w-2 h-2 rounded-full bg-current"></span>
              Process
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              currentStep === 'complete' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              <span className="w-2 h-2 rounded-full bg-current"></span>
              Complete
            </div>
          </div>
        </div>
      </div>

      {currentStep === 'scan' && (
        <ReceiptScanner
          onCapture={handleReceiptCapture}
          onClose={handleClose}
          onProcessReceipt={handleReceiptProcess}
        />
      )}

      {currentStep === 'process' && receiptImage && imageUrl && (
        <ReceiptProcessor
          imageFile={receiptImage}
          imageUrl={imageUrl}
          onCreateExpense={handleCreateExpense}
          onClose={handleClose}
        />
      )}

      {processingError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-6xl mb-4 font-bold text-red-600">Error</div>
              <h3 className="text-lg font-semibold mb-2">Processing Failed</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {processingError}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptScanPage;