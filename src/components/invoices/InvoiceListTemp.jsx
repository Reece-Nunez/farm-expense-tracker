import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const InvoiceListTemp = ({ onCreate }) => {
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

      {/* Placeholder Content */}
      <Card className="p-12 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-semibold mb-2">Invoice System Ready</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The invoice navigation is now working! The GraphQL schema needs to be deployed to AWS before invoice data can be managed.
        </p>
        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <p>✅ Navigation working</p>
          <p>✅ UI components created</p>
          <p>⏳ GraphQL schema deployment needed</p>
          <p>⏳ AWS Amplify push required</p>
        </div>
        <Button variant="primary" onClick={onCreate} className="mt-6">
          Test Invoice Form
        </Button>
      </Card>
    </div>
  );
};

export default InvoiceListTemp;